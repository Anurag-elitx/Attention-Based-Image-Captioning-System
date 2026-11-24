import torch
import torch.nn as nn

class BahdanauAttention(nn.Module):
    """
    Soft deterministic attention (Bahdanau-style MLP).
    e_{t,i} = w^T tanh(W_a·a_i + W_h·h_{t-1})
    α_t = softmax(e_t) over locations
    Context vector z_t = Σ α_{t,i}·a_i
    """
    def __init__(self, encoder_dim=2048, decoder_dim=512, attention_dim=512):
        super(BahdanauAttention, self).__init__()
        
        # W_a: transforms encoder's spatial features
        self.encoder_att = nn.Linear(encoder_dim, attention_dim)
        
        # W_h: transforms decoder's previous hidden state
        self.decoder_att = nn.Linear(decoder_dim, attention_dim)
        
        # w: calculates the final attention score from the transformed features
        self.full_att = nn.Linear(attention_dim, 1)
        
        self.softmax = nn.Softmax(dim=1)
        
    def forward(self, encoder_out, decoder_hidden):
        """
        Forward propagation.
        
        :param encoder_out: encoded images, a tensor of dimension (batch_size, num_pixels, encoder_dim)
        :param decoder_hidden: previous decoder output, a tensor of dimension (batch_size, decoder_dim)
        :return: context vector, attention weights
        """
        # (batch_size, num_pixels, attention_dim)
        att1 = self.encoder_att(encoder_out)
        
        # (batch_size, attention_dim)
        att2 = self.decoder_att(decoder_hidden)
        
        # Add the two along the num_pixels dimension
        # (batch_size, num_pixels, attention_dim)
        att = torch.tanh(att1 + att2.unsqueeze(1))
        
        # (batch_size, num_pixels, 1) -> (batch_size, num_pixels)
        scores = self.full_att(att).squeeze(2)
        
        # (batch_size, num_pixels)
        alpha = self.softmax(scores)
        
        # Multiply features by weights
        # (batch_size, encoder_dim)
        context_vector = (encoder_out * alpha.unsqueeze(2)).sum(dim=1)
        
        return context_vector, alpha

if __name__ == '__main__':
    attention = BahdanauAttention()
    dummy_encoder_out = torch.randn(2, 196, 2048)
    dummy_decoder_hidden = torch.randn(2, 512)
    context, alpha = attention(dummy_encoder_out, dummy_decoder_hidden)
    
    print(f"Context shape: {context.shape}")
    print(f"Alpha shape: {alpha.shape}")
    
    assert context.shape == (2, 2048), "Context shape is incorrect"
    assert alpha.shape == (2, 196), "Alpha shape is incorrect"
    assert torch.allclose(alpha.sum(dim=1), torch.ones(2)), "Alpha weights must sum to 1"
    print("Attention module is working as expected.")
