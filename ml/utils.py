import os
import shutil
import torch

class AverageMeter(object):
    """
    Keeps track of most recent, average, sum, and count of a metric.
    """
    def __init__(self):
        self.reset()

    def reset(self):
        self.val = 0
        self.avg = 0
        self.sum = 0
        self.count = 0

    def update(self, val, n=1):
        self.val = val
        self.sum += val * n
        self.count += n
        self.avg = self.sum / self.count

def clip_gradient(optimizer, grad_clip):
    """
    Clips gradients computed during backpropagation to avoid explosion of gradients.
    """
    for group in optimizer.param_groups:
        for param in group['params']:
            if param.grad is not None:
                param.grad.data.clamp_(-grad_clip, grad_clip)

def save_checkpoint(data_name, epoch, epochs_since_improvement, encoder, decoder, 
                    encoder_optimizer, decoder_optimizer, bleu4, is_best, checkpoints_dir):
    """
    Saves model checkpoint.
    """
    os.makedirs(checkpoints_dir, exist_ok=True)
    state = {'epoch': epoch,
             'epochs_since_improvement': epochs_since_improvement,
             'bleu-4': bleu4,
             'encoder': encoder,
             'decoder': decoder,
             'encoder_optimizer': encoder_optimizer,
             'decoder_optimizer': decoder_optimizer}
             
    filename = f'{checkpoints_dir}/checkpoint_{data_name}.pth.tar'
    torch.save(state, filename)
    
    if is_best:
        torch.save(state, f'{checkpoints_dir}/BEST_checkpoint_{data_name}.pth.tar')
        # Save individual state dicts for easier loading during inference/deployment
        if encoder is not None:
            torch.save(encoder.state_dict(), f'{checkpoints_dir}/encoder_best.pt')
        elif not os.path.exists(f'{checkpoints_dir}/encoder_best.pt'):
            from ml.encoder import Encoder
            base_enc = Encoder()
            torch.save(base_enc.state_dict(), f'{checkpoints_dir}/encoder_best.pt')

        if decoder is not None:
            torch.save(decoder.state_dict(), f'{checkpoints_dir}/decoder_best.pt')

        # Ensure word_map.json exists in checkpoints directory for inference engine
        wm_src = os.path.join(os.path.dirname(checkpoints_dir), 'data', 'processed', 'word_map.json')
        wm_dst = f'{checkpoints_dir}/word_map.json'
        if os.path.exists(wm_src) and not os.path.exists(wm_dst):
            shutil.copy(wm_src, wm_dst)

def accuracy(scores, targets, k):
    """
    Computes top-k accuracy, from predicted and true labels.
    """
    batch_size = targets.size(0)
    _, ind = scores.topk(k, 1, True, True)
    correct = ind.eq(targets.view(-1, 1).expand_as(ind))
    correct_total = correct.view(-1).float().sum()  # 0D tensor
    return correct_total.item() * (100.0 / batch_size)
