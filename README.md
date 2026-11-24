---
title: Attention Image Captioning API
emoji: 🖼️
colorFrom: indigo
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
---

# Attention-Based Image Captioning System 🖼️✨

A full-stack, enterprise-grade machine learning application that automatically generates descriptive captions for images using a **ResNet-101 Encoder** and an **Attention-Enhanced LSTM Decoder**, inspired by the seminal paper *"Show, Attend and Tell"*.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.12-blue.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)

---

## 🌟 Key Features

*   **Deep Learning Pipeline:** Implements a full CNN-RNN architecture (ResNet-101 + LSTM) with Bahdanau (Soft) Attention.
*   **Interactive Attention Heatmaps:** Hover over generated caption words in the UI to see exactly where the neural network was "looking" in the image.
*   **Robust FastAPI Backend:** Asynchronous, secure REST API backed by PostgreSQL (via SQLModel). Features JWT authentication and granular role-based access.
*   **Beautiful React Frontend:** A premium, dynamic user interface built with Vite, React, TypeScript, and Tailwind CSS v4. Features glassmorphism, micro-animations, and full dark-mode support.
*   **Dockerized Deployment:** Fully containerized for zero-friction deployments on Linux servers, bypassing local OS constraints (like Windows Defender Application Control).

## 🚀 Quick Start (Docker)

To run the entire stack (Frontend, Backend, and Database) effortlessly:

```bash
# 1. Clone the repository
git clone https://github.com/Anurag-elitx/Attention-Based-Image-Captioning-System.git
cd Attention-Based-Image-Captioning-System

# 2. Build and start the containers
docker compose up --build -d
```
*   **Frontend:** `http://localhost:80`
*   **Backend API:** `http://localhost:8000`
*   **Swagger Docs:** `http://localhost:8000/docs`

## 🧠 Machine Learning Pipeline

Due to Windows Defender Application Control (WDAC) policies often blocking PyTorch binaries on host machines, **we recommend running the ML training pipeline inside the Docker container**.

```bash
# Extract ResNet-101 features (Saves time during training)
docker exec captioning_api python ml/precompute_features.py --batch_size 64

# Train the Attention LSTM Decoder
docker exec captioning_api python ml/train.py

# Evaluate against Karpathy Test Split (BLEU, METEOR, CIDEr)
docker exec captioning_api python ml/eval.py
```

## 📁 Repository Structure

*   `backend/` - FastAPI application, SQLModel schemas, and routing logic.
*   `frontend/` - React/Vite web application.
*   `ml/` - Pure PyTorch machine learning pipeline (training, inference, evaluation).
*   `scripts/` - Automation scripts for dataset downloading and model weights.
*   `data/` - COCO dataset and precomputed `.h5` features (Git ignored).
*   `checkpoints/` - Saved model weights (Git ignored).
*   `docs/` - Architecture diagrams, viva notes, and the official Model Card.

## 📊 Evaluation Metrics

Target performance on the MS COCO (Karpathy) Test Split:
*   **BLEU-4:** ≥ 25.0
*   **CIDEr:** ≥ 90.0
*   **METEOR:** ≥ 23.0

## 🛡️ License
This project is open-source and available under the MIT License.