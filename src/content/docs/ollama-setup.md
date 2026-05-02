---
title: Ollama setup
description: How to install Ollama, pull models, and configure CORS for Lume.
---

Lume uses [Ollama](https://ollama.com) for local AI inference. Everything runs on your machine — no API keys, no cloud, no data leaving your infrastructure.

---

## Install Ollama

**macOS / Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**

Download the installer from [ollama.com/download](https://ollama.com/download).

---

## Pull a model

```bash
ollama pull qwen2.5
```

This downloads the `qwen2.5` 7B model (~4.7GB). See [model recommendations](/reference/models) for other options.

---

## Start Ollama

```bash
ollama serve
# Listening on http://localhost:11434
```

Lume connects to `http://localhost:11434` by default. The widget header shows a live connection status:

- 🟡 Yellow pulsing — connecting
- 🟢 Green — connected
- 🔴 Red — Ollama not reachable. Tooltip shows `run: ollama serve`

---

## CORS

If your app is served from a different origin than `localhost`, you need to allow it:

```bash
# allow all origins
OLLAMA_ORIGINS="*" ollama serve

# allow a specific domain
OLLAMA_ORIGINS="https://myapp.com" ollama serve
```

---

## Verify it's working

Run this to confirm Ollama is reachable and `qwen2.5` is installed:

```bash
ollama run qwen2.5 "reply only with: ok"
```

If it replies `ok` you're good to go.

---

## Apple Silicon

On M1/M2/M3 Macs, Ollama automatically uses the GPU via Metal. No configuration needed.

A MacBook Air M2 with 16GB RAM runs `qwen2.5` (7B) at ~40–60 tokens/sec — fast enough to feel instant in a chat widget.

---

## Next

- [Model recommendations](/reference/models) — compare available models
- [Getting started](/getting-started) — add the widget to your app