---
title: Props reference
description: Complete list of all AssistantWidget and LumeProvider props.
---

All props are optional. When using `LumeProvider`, props passed directly to `AssistantWidget` override provider values.

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `string` | `'qwen2.5'` | Ollama model to use |
| `systemPrompt` | `string` | `'You are a helpful assistant.'` | Persona and instructions for the assistant |
| `context` | `Record<string, string \| number \| boolean \| null>` | — | Current app state injected into every prompt |
| `knowledgeBase` | `KnowledgeChunk[]` | `[]` | Documentation chunks for RAG retrieval |
| `actions` | `Action[]` | `[]` | App functions the assistant can trigger |
| `components` | `ComponentDefinition[]` | `[]` | React components the assistant can render |
| `accentColor` | `string` | `'#6366f1'` | Bubble and send button color |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Corner to anchor the widget to |
| `title` | `string` | `'Assistant'` | Label shown in the panel header |
| `debug` | `boolean` | `false` | Show intent classification badge on each message |

---

## Types

### KnowledgeChunk

```ts
interface KnowledgeChunk {
  title: string
  content: string
}
```

### Action

```ts
interface Action {
  name: string
  description: string
  parameters?: Record<string, ActionParameter>
  examples?: string[]
  handler: (params: Record<string, unknown>) => Promise<void>
}

interface ActionParameter {
  type: 'string' | 'number' | 'boolean'
  description: string
  required?: boolean
}
```

### ComponentDefinition

```ts
interface ComponentDefinition {
  type: string
  description: string
  props?: Record<string, ComponentPropDefinition>
  examples?: string[]
  render: (props: Record<string, unknown>) => React.ReactNode
}

interface ComponentPropDefinition {
  type: string
  required?: boolean
  description: string
}
```

### AssistantHandle

```ts
interface AssistantHandle {
  open: () => void
  close: () => void
  toggle: () => void
  pushContext: (note: string) => void
  clearHistory: () => void
}
```

### ConfirmationState

```ts
type ConfirmationState =
  | { status: 'idle' }
  | { status: 'pending';   call: ActionCall; action: Action }
  | { status: 'executing'; call: ActionCall; action: Action }
```

### Message

```ts
interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  intent?: string
  componentCall?: {
    component: string
    props: Record<string, unknown>
  }
}
```