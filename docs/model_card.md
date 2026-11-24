# Model Card: Attention-Based Image Captioning

## Model Details

*   **Model Type:** Convolutional Neural Network (CNN) + Recurrent Neural Network (RNN) with Soft Attention.
*   **Architecture:** ResNet-101 (Encoder) + LSTM with Bahdanau Attention (Decoder).
*   **Training Framework:** PyTorch 2.0+
*   **Language:** English
*   **Paper Reference:** *Show, Attend and Tell: Neural Image Caption Generation with Visual Attention* (Xu et al., 2015).

## Intended Use

*   **Primary Use Case:** Generating descriptive natural language captions for a wide variety of photographs.
*   **Secondary Use Case:** Educational demonstration of attention mechanisms in neural networks through visual heatmap overlays.
*   **Out-of-Scope Uses:** Medical imaging analysis, facial recognition, or critical decision-making systems.

## Training Data

*   **Dataset:** MS COCO (Common Objects in Context) 2014 dataset.
*   **Size:** 82,783 training images, 40,504 validation images.
*   **Splits:** Karpathy splits (5,000 val, 5,000 test).
*   **Annotations:** 5 human-generated captions per image.

## Evaluation Metrics (Target)

Evaluated on the 5,000 Karpathy test split images using `pycocoevalcap`.
*   **BLEU-4:** ≥ 25.0
*   **CIDEr:** ≥ 90.0
*   **METEOR:** ≥ 23.0

## Ethical Considerations & Bias

*   **Dataset Bias:** MS COCO is biased towards North American and Western European contexts. The model may perform poorly on images from other cultural contexts.
*   **Gender Bias:** The model may assume genders based on stereotypical visual cues present in the training data.
*   **Mitigation:** Users are encouraged to view this model as an educational tool rather than a perfectly unbiased AI.

## Caveats and Recommendations

*   The model assumes English language output only.
*   The ResNet-101 encoder expects images of size 224x224 and normalized using ImageNet statistics. Unusually aspect-ratioed images may suffer distortion during the scaling phase.
