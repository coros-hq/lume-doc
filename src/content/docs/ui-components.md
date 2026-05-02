---
title: UI Components
description: Let the assistant render your own React components inline in the chat instead of plain text.
---

Instead of answering with plain text, the assistant can render your own React components directly in the chat. You define the component type, its props schema, and a render function — Lume handles the routing and rendering.

---

## Basic usage

Use `defineComponent` to register a component:

```tsx
import { defineComponent } from '@ovt2/lume'

const components = [
  defineComponent(
    'billing_summary',
    {
      description: 'Show billing info when the user asks about their plan, payments, or subscription',
      props: {
        plan:   { type: 'string', required: true,  description: 'Plan name e.g. Pro' },
        status: { type: 'string', required: true,  description: 'active or past_due' },
        amount: { type: 'string', required: false, description: 'Amount due e.g. $49.00' },
      },
    },
    (props) => (
      <BillingCard
        plan={String(props.plan)}
        status={String(props.status)}
        amount={props.amount ? String(props.amount) : undefined}
      />
    )
  ),
]

<LumeProvider components={components} ...>
```

---

## How it works

1. User types `"what is my billing status?"`
2. Intent classifier routes to `component:billing_summary` (~200ms)
3. Lume builds a focused prompt: fill these props from app context
4. Model returns `{"component": "billing_summary", "props": {"plan": "Pro", "status": "active", ...}}`
5. Lume calls `render(props)` and displays the result as an assistant bubble
6. Component persists in conversation history — subsequent messages continue normally

---

## Adding examples

Add example phrases to improve intent matching:

```tsx
defineComponent(
  'billing_summary',
  {
    description: 'Show billing info when the user asks about their plan or payments',
    examples: [
      'what is my billing status',
      'how much do I owe',
      'when does my card get charged',
      'am I being charged correctly',
      'show me my invoice',
    ],
    props: { ... },
  },
  (props) => <BillingCard {...props} />
)
```

Examples are optional. A clear `description` handles most cases on its own — add examples only when you notice a phrase not triggering correctly.

---

## Props

Props are the data the model fills in from app context before calling your render function. Each prop has a type, description, and optional required flag:

```tsx
props: {
  // simple value
  plan: {
    type: 'string',
    required: true,
    description: 'Plan name e.g. Pro, Business, or Free',
  },

  // optional value
  nextBilling: {
    type: 'string',
    required: false,
    description: 'Next billing date e.g. May 14, 2025',
  },

  // number
  usagePercent: {
    type: 'number',
    required: true,
    description: 'Percentage of plan quota used, 0-100',
  },

  // array — pass as JSON string, parse in render
  members: {
    type: 'string',
    required: true,
    description: 'JSON array of {name, email, role} objects',
  },
}
```

Supported prop types: `string`, `number`, `boolean`.

For arrays and objects, use `type: 'string'` and pass JSON — parse it inside your render function:

```tsx
(props) => {
  const members = Array.isArray(props.members)
    ? props.members
    : JSON.parse(String(props.members ?? '[]'))

  return <TeamList members={members} />
}
```

---

## Multiple components

Register as many components as your app needs:

```tsx
const components = [
  defineComponent('billing_summary', { ... }, (props) => <BillingCard {...props} />),
  defineComponent('user_profile',    { ... }, (props) => <ProfileCard {...props} />),
  defineComponent('usage_bar',       { ... }, (props) => <UsageBar    {...props} />),
  defineComponent('team_list',       { ... }, (props) => <TeamList    {...props} />),
  defineComponent('order_status',    { ... }, (props) => <OrderCard   {...props} />),
]
```

---

## Writing good descriptions

The description is what the intent classifier uses to route messages to your component. Write it to match the kinds of things users actually say:

```tsx
// too vague — won't match indirect phrases
description: 'Billing component'

// good — matches obvious and indirect phrasings
description: 'Show billing info when the user asks about their plan, subscription, payments, invoices, or charges'
```

If a component still isn't triggering for certain phrases, add those phrases as `examples`.

---

## Key principle

Lume ships with zero built-in components. Every component is defined and rendered entirely by your app. Lume only handles:

- Telling the model what components exist
- Routing the intent to the right component
- Filling props from app context
- Calling `render(props)`

The visual output is 100% yours — use any UI library, any styles, any logic.

---

## When to use components vs plain text

| Use a component | Use plain text |
|-----------------|----------------|
| User asks to *see* data | User asks *how* to do something |
| "show my billing status" | "how do I update my card?" |
| "who is on my team?" | "can I add more team members?" |
| "what plan am I on?" | "what does the Pro plan include?" |

The model decides based on your `description`. Write it to match data-display scenarios, not how-to questions.