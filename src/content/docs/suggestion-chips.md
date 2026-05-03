---
title: Suggestion chips
description: Show pre-defined prompts before the first message to guide users.
---

Suggestion chips are tappable prompt buttons shown above the input bar before the user sends their first message. They reduce friction for first-time users who don't know what to ask.

---

## Basic usage

```tsx
<LumeProvider
  suggestions={[
    'What is my billing status?',
    'Who is on my team?',
    'How do I reset my password?',
    'Show my usage',
  ]}
  ...
>
```

Or directly on the widget:

```tsx
<AssistantWidget
  suggestions={[
    'What is my billing status?',
    'Who is on my team?',
  ]}
/>
```

---

## Behaviour

- Chips appear when the widget opens and no messages exist yet
- Tapping a chip sends it immediately — same as typing and hitting enter
- Chips disappear after the first message is sent
- If the user clears conversation history, chips reappear

---

## Choosing good suggestions

Pick 3–5 of the most common questions users ask. Good candidates are:

- Questions that benefit from a structured UI component response — `"What is my billing status?"`
- Questions that trigger a useful action — `"Take me to settings"`
- Common how-to questions your knowledge base covers well — `"How do I reset my password?"`

Avoid vague suggestions like `"Help"` or `"Tell me more"` — they don't give the user a clear idea of what to expect.