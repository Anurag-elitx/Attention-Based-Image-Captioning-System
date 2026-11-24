import torch
import torch.nn as nn
import torchvision.models as models

class Encoder(nn.Module):
    """
    ResNet-101 encoder based on "Show, Attend and Tell".
    Removes the last two layers (avgpool and fc) to output a spatial feature map
    of size 14x14x2048 for an input of size 224x224.
    """
    def __init__(self, encoded_image_size=14):
        super(Encoder, self).__init__()
        self.enc_image_size = encoded_image_size
        
        # Load pretrained ResNet-101
        resnet = models.resnet101(weights=models.ResNet101_Weights.IMAGENET1K_V1)
        
        # Remove linear and pool layers
        modules = list(resnet.children())[:-2]
        self.resnet = nn.Sequential(*modules)
        
        # Resize output to standard size if needed
        self.adaptive_pool = nn.AdaptiveAvgPool2d((encoded_image_size, encoded_image_size))
        
        self.fine_tune()
        
    def forward(self, images):
        """
        Forward propagation.
        
        :param images: images, a tensor of dimensions (batch_size, 3, image_size, image_size)
        :return: encoded images
        """
        out = self.resnet(images)  # (batch_size, 2048, image_size/32, image_size/32)
        out = self.adaptive_pool(out)  # (batch_size, 2048, encoded_image_size, encoded_image_size)
        
        # Permute to (batch_size, encoded_image_size, encoded_image_size, 2048)
        out = out.permute(0, 2, 3, 1)
        
        # Flatten the spatial dimensions to output (batch_size, 196, 2048)
        batch_size = out.size(0)
        out = out.view(batch_size, -1, 2048)
        
        return out
        
    def fine_tune(self, fine_tune=False):
        """
        Allow or prevent the computation of gradients for convolutional blocks 2 through 4 of the encoder.
        
        :param fine_tune: bool
        """
        for p in self.resnet.parameters():
            p.requires_grad = False
            
        # If fine-tuning, only fine-tune convolutional blocks 2 through 4
        if fine_tune:
            for c in list(self.resnet.children())[5:]:
                for p in c.parameters():
                    p.requires_grad = True

if __name__ == '__main__':
    encoder = Encoder()
    dummy_input = torch.randn(1, 3, 224, 224)
    out = encoder(dummy_input)
    print(f"Input shape: {dummy_input.shape}")
    print(f"Output shape: {out.shape}")
    assert out.shape == (1, 196, 2048), "Output shape should be (1, 196, 2048)"
    print("Encoder is working as expected.")
