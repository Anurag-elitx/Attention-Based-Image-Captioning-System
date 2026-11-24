import os
import sys

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import time
import argparse
import torch
import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence
from torch.utils.data import DataLoader
import json
import os

from ml.dataset import CocoCaptionDataset
from ml.decoder import AttentionLSTMDecoder
from ml.encoder import Encoder
from ml.utils import AverageMeter, clip_gradient, save_checkpoint, accuracy
from ml.config import Config

def train_epoch(train_loader, encoder, decoder, criterion, encoder_optimizer, decoder_optimizer, 
                epoch, scaler, device):
    """
    Performs one epoch's training.
    """
    decoder.train()
    if encoder is not None:
        encoder.train()
        
    batch_time = AverageMeter()
    data_time = AverageMeter()
    losses = AverageMeter()
    top5accs = AverageMeter()
    
    start = time.time()
    
    # We use gradient accumulation logic as configured
    accumulation_steps = Config.grad_accumulation_steps
    
    for i, (imgs, caps, caplens) in enumerate(train_loader):
        data_time.update(time.time() - start)
        
        imgs = imgs.to(device)
        caps = caps.to(device)
        caplens = caplens.to(device)
        
        # Forward pass with AMP
        with torch.amp.autocast('cuda', enabled=scaler is not None):
            # Forward pass
            if encoder is not None:
                imgs = encoder(imgs)
            
            scores, caps_sorted, decode_lengths, alphas, sort_ind = decoder(imgs, caps, caplens)
            
            # Since we decoded starting with <start>, the targets are all words after <start>, up to <end>
            targets = caps_sorted[:, 1:]
            
            # Remove timesteps that we didn't decode at, or are pads
            # pack_padded_sequence with .data extracts the packed 2D tensors
            scores = pack_padded_sequence(scores, decode_lengths, batch_first=True).data
            targets = pack_padded_sequence(targets, decode_lengths, batch_first=True).data
            
            # Calculate loss
            loss = criterion(scores, targets)
            
            # Add doubly stochastic attention regularization
            loss += Config.alpha_c * ((1. - alphas.sum(dim=1)) ** 2).mean()
            
            # Normalize loss for gradient accumulation
            loss = loss / accumulation_steps
            
        # Backward pass with AMP
        if scaler is not None:
            scaler.scale(loss).backward()
        else:
            loss.backward()
            
        if (i + 1) % accumulation_steps == 0:
            if scaler is not None:
                # Unscales the gradients of optimizer's assigned params in-place
                scaler.unscale_(decoder_optimizer)
                if encoder_optimizer is not None:
                    scaler.unscale_(encoder_optimizer)
                    
            # Clip gradients
            clip_gradient(decoder_optimizer, Config.grad_clip)
            if encoder_optimizer is not None:
                clip_gradient(encoder_optimizer, Config.grad_clip)
                
            if scaler is not None:
                scaler.step(decoder_optimizer)
                if encoder_optimizer is not None:
                    scaler.step(encoder_optimizer)
                scaler.update()
            else:
                decoder_optimizer.step()
                if encoder_optimizer is not None:
                    encoder_optimizer.step()
                    
            decoder_optimizer.zero_grad()
            if encoder_optimizer is not None:
                encoder_optimizer.zero_grad()
                
        # Keep track of metrics (multiply back loss to report actual loss)
        losses.update(loss.item() * accumulation_steps, sum(decode_lengths))
        top5 = accuracy(scores, targets, 5)
        top5accs.update(top5, sum(decode_lengths))
        batch_time.update(time.time() - start)
        start = time.time()
        
        # Print status
        if i % 100 == 0:
            print(f'Epoch: [{epoch}][{i}/{len(train_loader)}]\t'
                  f'Batch Time {batch_time.val:.3f} ({batch_time.avg:.3f})\t'
                  f'Data Load Time {data_time.val:.3f} ({data_time.avg:.3f})\t'
                  f'Loss {losses.val:.4f} ({losses.avg:.4f})\t'
                  f'Top-5 Acc {top5accs.val:.3f} ({top5accs.avg:.3f})')

    return losses.avg

def main(epochs=None, batch_size=None, lr=None):
    device = torch.device(Config.device if torch.cuda.is_available() else "cpu")
    num_epochs = epochs or Config.epochs
    train_batch_size = batch_size or Config.batch_size
    learning_rate = lr or Config.decoder_lr

    print(f"Starting training on {device} (Epochs: {num_epochs}, Batch size: {train_batch_size}, LR: {learning_rate})")
    
    # Load vocabulary size
    word_map_path = os.path.join(Config.data_folder, 'processed', 'word_map.json')
    if not os.path.exists(word_map_path):
        print(f"Error: {word_map_path} not found. Please build vocabulary first.")
        return
        
    with open(word_map_path, 'r') as f:
        word_map = json.load(f)
    vocab_size = len(word_map)
    
    # Initialize / load model
    decoder = AttentionLSTMDecoder(attention_dim=Config.attention_dim,
                                   embed_dim=Config.emb_dim,
                                   decoder_dim=Config.decoder_dim,
                                   vocab_size=vocab_size,
                                   dropout=Config.dropout)
                                   
    decoder = decoder.to(device)
    decoder_optimizer = torch.optim.Adam(params=filter(lambda p: p.requires_grad, decoder.parameters()),
                                         lr=learning_rate)
                                         
    # If using precomputed features, encoder is None in the training loop
    # We will assume precomputed features for training the decoder
    encoder = None
    encoder_optimizer = None
    
    # Loss function
    criterion = nn.CrossEntropyLoss().to(device)
    
    # Custom dataloader
    train_dataset = CocoCaptionDataset(Config.data_folder, 'train')
    train_loader = DataLoader(train_dataset, batch_size=train_batch_size, shuffle=True, 
                              num_workers=Config.workers, pin_memory=True if device.type == 'cuda' else False)
                              
    # Optional mixed precision
    scaler = torch.amp.GradScaler('cuda') if device.type == 'cuda' else None
    
    # Epochs tracking
    best_loss = float('inf')
    best_bleu4 = 0.0
    epochs_since_improvement = 0
    
    for epoch in range(num_epochs):
        if epochs_since_improvement > 8:
            print("Early stopping as there's no improvement for 8 epochs.")
            break
            
        # Halve learning rate if no improvement for 8 epochs
        if epochs_since_improvement > 0 and epochs_since_improvement % 8 == 0:
            for param_group in decoder_optimizer.param_groups:
                param_group['lr'] = param_group['lr'] * 0.5
                print(f"Halved decoder learning rate to {param_group['lr']}")
                
        # One epoch's training
        train_loss = train_epoch(train_loader=train_loader,
                                 encoder=encoder,
                                 decoder=decoder,
                                 criterion=criterion,
                                 encoder_optimizer=encoder_optimizer,
                                 decoder_optimizer=decoder_optimizer,
                                 epoch=epoch,
                                 scaler=scaler,
                                 device=device)
                    
        is_best = train_loss < best_loss
        if is_best:
            best_loss = train_loss
            epochs_since_improvement = 0
            print(f"Epoch {epoch}: New best training loss: {best_loss:.4f}")
        else:
            epochs_since_improvement += 1
            print(f"Epoch {epoch}: No improvement ({epochs_since_improvement}/8)")

        save_checkpoint("coco", epoch, epochs_since_improvement, encoder, decoder, 
                        encoder_optimizer, decoder_optimizer, best_bleu4, is_best, Config.checkpoint_dir)

    train_dataset.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Train Attention-Based Image Captioning Model")
    parser.add_argument("--epochs", type=int, default=None, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=None, help="Training batch size")
    parser.add_argument("--lr", type=float, default=None, help="Decoder learning rate")
    args = parser.parse_args()
    main(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
