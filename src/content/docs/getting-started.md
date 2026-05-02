---
title: Getting started
description: Install Lume and add an AI assistant to your React app in under 5 minutes.
---

Lume is an embeddable AI assistant widget for any React app. It runs entirely on your machine via [Ollama](https://ollama.com) — no cloud, no API keys, no data leaving your infrastructure.

## Prerequisites

Before installing Lume, you need Ollama running locally with a model pulled.

**1. Install Ollama:**

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh
```

**2. Pull the recommended model:**

```bash
ollama pull qwen2.5
```

**3. Start Ollama:**

```bash
ollama serve
```

Ollama listens on `http://localhost:11434` by default. Lume connects there automatically.

---

## Installation

```bash
npm install @ovt2/lume
```

**Requirements:**
- Node.js 18+
- React 17+

---

## Your first widget

The simplest possible integration — drop one component into your app:

```tsx
import { AssistantWidget } from '@ovt2/lume'

function App() {
  return (
    <>
      {/* your existing app */}
      <AssistantWidget
        systemPrompt="You are a helpful assistant for this app."
      />
    </>
  )
}
```

A floating bubble appears in the bottom-right corner. Click it — a chat panel slides up. The assistant is ready to answer questions.

---

## Recommended setup

For a real integration, use `LumeProvider` at the root of your app. This lets you configure everything once and control context from anywhere:

```tsx
import { LumeProvider, useLume, AssistantWidget, defineAction, defineComponent } from '@ovt2/lume'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const actions = [
    defineAction(
      'redirectTo',
      {
        description: 'Navigate to a page in the app',
        parameters: {
          page: { type: 'string', required: true, description: 'Page name' },
        },
      },
      async ({ page }) => setPage(page as string)
    ),
  ]

  return (
    <LumeProvider
      model="qwen2.5"
      systemPrompt="You are a support assistant for Acme."
      actions={actions}
      accentColor="#6366f1"
      title="Acme Support"
    >
      <InnerApp page={page} />
    </LumeProvider>
  )
}

function InnerApp({ page }: { page: string }) {
  const { setContext } = useLume()

  // sync context whenever page changes
  useEffect(() => {
    setContext({ currentPage: page })
  }, [page])

  return (
    <>
      {/* your app */}
      <AssistantWidget />
    </>
  )
}
```

---

## What's next

- [LumeProvider](/lumeprovider) — set up context, actions, and components at the root
- [Actions](/actions) — let the assistant trigger real functions in your app
- [UI Components](/ui-components) — let the assistant render your own React components
- [Knowledge base](/knowledge-base) — give the assistant your documentation