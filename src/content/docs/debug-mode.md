---
title: Debug mode
description: See intent classification on every message to diagnose routing issues fast.
---

Debug mode adds a small intent badge under every user message showing how the classifier routed it. It's the fastest way to diagnose why something isn't triggering correctly.

---

## Enable it

```tsx
<AssistantWidget debug />
// or at the provider level
<LumeProvider debug ...>
```

---

## What you see

Each user message shows a badge underneath it:

| Badge | Color | Meaning |
|-------|-------|---------|
| `action:redirectTo` | Purple | Matched an action |
| `component:usage_bar` | Teal | Matched a component |
| `text` | Gray | Plain conversation |

---

## Diagnosing problems

**Scenario: component isn't triggering**

User types "am I close to my limit" — expects `usage_bar` but gets a plain text answer.

Check the badge:

- Badge shows `text` → classifier didn't match the intent → fix the `description` or add the phrase as an `example`
- Badge shows `component:usage_bar` → classifier worked but the JSON response was malformed → check the `props` schema

**Scenario: wrong component triggers**

User asks a billing question but `user_profile` renders instead of `billing_summary`.

Check the badge — it shows `component:user_profile`. The descriptions of the two components overlap. Make each description more specific and distinct.

**Scenario: action triggers on a question**

User asks "what is on the dashboard?" and a navigation confirmation card appears.

Badge shows `action:redirectTo`. The description `"Navigate to a page"` is matching questions that mention page names. Make the description more specific: `"Navigate to a page when the user explicitly asks to go somewhere"`.

---

## Remove before production

Debug mode is for development only. Remove it before shipping:

```tsx
// development
<AssistantWidget debug />

// production
<AssistantWidget />
```

The `debug` prop has zero effect on behavior — it only adds the visual badge.