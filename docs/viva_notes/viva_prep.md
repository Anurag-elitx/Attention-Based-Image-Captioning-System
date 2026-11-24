# Comprehensive Viva Prep Guide

This document is designed to prepare you for your final OJT Viva by answering the most common and difficult questions an examiner might ask about your **Attention-Based Image Captioning System**.

## 1. Architectural Decisions

**Q: Why did you use ResNet-101 instead of a more modern Vision Transformer (ViT)?**
**A:** The PRD explicitly required a traditional CNN-RNN architecture to demonstrate a foundational understanding of deep learning concepts, specifically the "Show, Attend and Tell" paper. While ViT + Transformers represent the current state-of-the-art, building an LSTM with a custom Bahdanau Attention mechanism from scratch demonstrates a deeper understanding of sequential recurrence and gradients than simply fine-tuning a HuggingFace Transformer model.

**Q: Why did you separate the ML pipeline from the FastAPI backend?**
**A:** Decoupling the system allows for independent scaling and avoids memory leaks. PyTorch requires massive amounts of VRAM. By isolating the ML logic into `ml/` and communicating with it via `subprocess` or background queues in FastAPI, we prevent the web server (which needs to be highly concurrent) from blocking while the GPU crunches matrices.

**Q: Why did you Dockerize the application?**
**A:** Security constraints on my development machine (Windows Defender Application Control) blocked unsigned PyTorch `.dll` files. Dockerizing the application into a Linux container completely bypassed these OS-level restrictions, ensuring the pipeline could run anywhere. It also makes deployment to platforms like Render or Railway a one-click process.

## 2. Technical ML Deep Dive

**Q: How does the Bahdanau (Soft) Attention mechanism actually work in your code?**
**A:** At each time step `t` in the LSTM decoder, the attention mechanism looks at the hidden state `h_{t-1}` and the 196 spatial features from the ResNet encoder. It passes both through fully connected layers, adds them, and applies a `tanh` activation followed by a `softmax`. This produces an array of 196 probabilities (`alpha` weights) that sum to 1. We multiply these weights against the ResNet features to create a single "context vector" `z_t`, which tells the LSTM exactly which parts of the image to focus on for the next word.

**Q: What is Doubly Stochastic Regularization?**
**A:** In our loss function, we add a penalty term: `lambda * (1 - sum(alphas))^2`. Over the course of generating a full caption, we want the model to look at *every* part of the image at least once. If the sum of attention weights across all time steps for a specific pixel diverges from 1, we penalize it. This forces the model to sweep its attention across the entire image.

**Q: Why did you use Beam Search instead of Greedy Decoding?**
**A:** Greedy decoding simply picks the highest-probability word at each step. This can lead to local optima where picking a slightly suboptimal word early on would have led to a much better overall sentence. Beam search (with `k=5`) maintains the top 5 most likely sequence prefixes at every step, significantly improving the overall BLEU score of the final caption.

## 3. Evaluation and Performance

**Q: What are your evaluation metrics and how do they work?**
**A:** 
1. **BLEU (Bilingual Evaluation Understudy):** Measures exact n-gram overlap between the generated caption and the 5 human reference captions. BLEU-4 is our primary metric.
2. **METEOR:** Similar to BLEU but includes synonyms and stemming, making it better at judging semantic similarity.
3. **CIDEr (Consensus-based Image Description Evaluation):** Gives higher weight to n-grams that are unique to a specific image (TF-IDF weighted), penalizing generic captions like "a dog on the grass" if a more specific caption was provided by humans.

## 4. Failure Modes & Limitations

**Q: Where does your model fail?**
**A:**
1. **Counting:** The model struggles to count objects accurately (e.g., saying "three dogs" when there are four).
2. **Color Binding:** It sometimes misattributes colors to the wrong objects (e.g., "a red car and a blue man" instead of "a blue car and a red man").
3. **Out-of-Distribution Data:** Because it was trained on MS COCO (everyday scenes), it will fail completely on medical X-rays, satellite imagery, or abstract art.
