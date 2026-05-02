---
title: defineComponent
description: Register a React component the assistant can render inline in the chat.
---

`defineComponent` is a helper function for registering UI components with full TypeScript support and IDE autocomplete.

---

## Signature

```ts
function defineComponent(
  type: string,
  options: DefineComponentOptions,
  render: (props: Record<string, unknown>) => React.ReactNode
): ComponentDefinition
```

---

## Parameters

### type

A unique identifier for the component. Used by the classifier and renderer — never shown to the user.

```tsx
defineComponent('billing_summary', ...)
defineComponent('user_profile', ...)
defineComponent('order_status', ...)
```

### options.description

What the component shows and when. The intent classifier uses this to route messages. Write it to match the kinds of things users ask:

```tsx
// good — matches obvious and indirect phrasings
description: 'Show billing info when the user asks about their plan, subscription, payments, invoices, or charges'

// too vague
description: 'Billing card'
```

### options.props

The data the model fills in from app context before calling your render function:

```tsx
props: {
  plan: {
    type: 'string',
    required: true,
    description: 'Current plan name e.g. Pro',
  },
  status: {
    type: 'string',
    required: true,
    description: 'active, cancelled, or past_due',
  },
  nextBilling: {
    type: 'string',
    required: false,
    description: 'Next billing date',
  },
}
```

Supported types: `string`, `number`, `boolean`. For arrays, use `type: 'string'` and pass JSON.

### options.examples

Optional. Example phrases that trigger this component:

```tsx
examples: [
  'what is my billing status',
  'how much do I owe',
  'when does my card get charged',
]
```

### render

A function that receives the filled props and returns a React node. All prop values are typed as `unknown` — cast to the expected type:

```tsx
(props) => (
  <BillingCard
    plan={String(props.plan)}
    status={String(props.status)}
    nextBilling={props.nextBilling ? String(props.nextBilling) : undefined}
  />
)
```

---

## Full example

```tsx
defineComponent(
  'usage_bar',
  {
    description: 'Show usage or quota info when the user asks how much of their plan they have used',
    examples: [
      'how much of my plan have I used',
      'what is my remaining credit',
      'am I close to my limit',
      'show my usage',
    ],
    props: {
      label: { type: 'string', required: true,  description: 'What is being measured e.g. API calls' },
      used:  { type: 'number', required: true,  description: 'Percentage used 0-100' },
      plan:  { type: 'string', required: false, description: 'Plan name for context' },
    },
  },
  (props) => {
    const used = Math.min(100, Math.max(0, Number(props.used ?? 0)))
    const color = used > 90 ? 'red' : used > 70 ? 'yellow' : 'green'
    return (
      <div>
        <span>{String(props.label)}</span>
        <span>{used}%</span>
        <progress value={used} max={100} />
      </div>
    )
  }
)
```