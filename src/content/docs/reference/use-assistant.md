---
title: useAssistant
description: Low-level hook for building completely custom chat UIs.
---

`useAssistant` gives you full control over the chat experience while keeping all the core logic — streaming, intent classification, RAG, actions, and components.

Use this when the default `AssistantWidget` UI doesn't fit your needs.

---

## Usage

```tsx
import { useAssistant } from '@ovt2/lume'

function MyCustomChat() {
  const {
    messages,
    isStreaming,
    error,
    confirmation,
    send,
    stop,
    clearHistory,
    pushContext,
    confirmAction,
    cancelAction,
  } = useAssistant({
    model: 'qwen2.5',
    systemPrompt: 'You are a helpful assistant.',
    context: { page: 'Dashboard' },
    knowledgeBase: docs,
    actions: myActions,
    components: myComponents,
  })

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>{m.content}</div>
      ))}
      <input onKeyDown={(e) => e.key === 'Enter' && send(e.currentTarget.value)} />
    </div>
  )
}
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `string` | `'qwen2.5'` | Ollama model |
| `systemPrompt` | `string` | `'You are a helpful assistant.'` | Assistant persona |
| `context` | `ContextObject` | — | Current app state |
| `knowledgeBase` | `KnowledgeChunk[]` | `[]` | Docs for RAG |
| `actions` | `Action[]` | `[]` | Registered actions |
| `components` | `ComponentDefinition[]` | `[]` | Registered components |

---

## Returns

| Field | Type | Description |
|-------|------|-------------|
| `messages` | `Message[]` | Full conversation history |
| `isStreaming` | `boolean` | True while a response is generating |
| `error` | `string \| null` | Last error message |
| `confirmation` | `ConfirmationState` | Current action confirmation state |
| `send(text)` | `function` | Send a user message |
| `stop()` | `function` | Abort the current stream |
| `clearHistory()` | `function` | Reset the conversation |
| `pushContext(note)` | `function` | Inject a hidden system note |
| `confirmAction()` | `function` | Execute the pending action |
| `cancelAction()` | `function` | Dismiss the pending action |

---

## Rendering component messages

Messages with a `componentCall` should render your component instead of text:

```tsx
{messages.filter(m => m.role !== 'system').map((msg, i) => {
  if (msg.componentCall) {
    const definition = components.find(c => c.type === msg.componentCall.component)
    return (
      <div key={i} className="assistant-bubble">
        {definition?.render(msg.componentCall.props)}
      </div>
    )
  }

  return (
    <div key={i} className={msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'}>
      {msg.content}
    </div>
  )
})}
```

---

## Handling confirmation

When `confirmation.status === 'pending'`, show a confirmation UI:

```tsx
{confirmation.status === 'pending' && (
  <div>
    <p>{confirmation.action.description}</p>
    <button onClick={confirmAction}>Confirm</button>
    <button onClick={cancelAction}>Cancel</button>
  </div>
)}
```