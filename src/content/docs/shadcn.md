---
title: shadcn/ui
description: Lume's internal UI is built with shadcn/ui — use the same components in your own registered components with zero extra setup.
---

Lume's internal chat UI is built with [shadcn/ui](https://ui.shadcn.com) components. If your app already uses shadcn, your components will share the same design tokens and look native inside the chat panel. If you don't use shadcn yet, Lume works fine — the UI is self-contained.

---

## What ships with Lume

Lume includes a set of shadcn components bundled internally:

| Component | Used for |
|-----------|----------|
| `Button` | Send button, action confirmations |
| `Card` | Confirmation cards, component wrappers |
| `Badge` | Debug mode intent labels |
| `Alert` | Error strip |
| `Textarea` | Chat input |
| `ScrollArea` | Message history scroll container |
| `Separator` | Visual dividers |

These are not exported from `@ovt2/lume` — they're implementation details. You don't need to install or configure anything for them.

---

## How it works internally

Lume follows the standard shadcn/ui conventions:

**`cn()` utility** — a `clsx` + `tailwind-merge` helper used across every component:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**`cva` variants** — components use `class-variance-authority` for variant management. For example, `Button` exposes `variant` (`default`, `outline`, `ghost`, `destructive`, `link`, `secondary`) and `size` (`xs`, `sm`, `default`, `lg`, `icon`).

**Radix UI primitives** — components use `radix-ui` for accessible behavior (focus trapping, keyboard navigation, ARIA attributes).

**CSS variables** — styling is driven by design tokens (`--primary`, `--card`, `--muted`, `--ring`, etc.) so theming works through your stylesheet, not hardcoded values.

---

## Using shadcn components inside `defineComponent`

If your app has shadcn installed, you can use your own components directly inside `defineComponent` render functions — they'll look consistent with Lume's UI since they share the same CSS variable layer.

```tsx
import { defineComponent } from '@ovt2/lume'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const components = [
  defineComponent(
    'plan_summary',
    {
      description: 'Show the user their current plan and usage when they ask about their subscription',
      props: {
        plan:   { type: 'string', required: true,  description: 'Plan name e.g. Pro' },
        usage:  { type: 'number', required: true,  description: 'Percentage of quota used, 0–100' },
        status: { type: 'string', required: true,  description: 'active or past_due' },
      },
    },
    (props) => (
      <Card>
        <CardHeader>
          <CardTitle>Your plan</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Badge variant={props.status === 'active' ? 'default' : 'destructive'}>
            {String(props.status)}
          </Badge>
          <span className="font-medium">{String(props.plan)}</span>
          <span className="text-muted-foreground text-sm">
            {Number(props.usage)}% used
          </span>
        </CardContent>
      </Card>
    )
  ),
]
```

No special configuration needed — just import and use your components exactly as you would anywhere else in your app.

---

## Theming

Lume reads the same CSS custom properties your shadcn theme defines. If you've customized your theme (e.g. via `globals.css` or a shadcn theme preset), those changes automatically apply inside the Lume chat panel too.

If you're not using shadcn, you can still theme Lume through the `accentColor` prop on `LumeProvider`, which sets the primary color token:

```tsx
<LumeProvider accentColor="#6366f1" ...>
```

For deeper theming without shadcn, override the CSS variables Lume uses directly in your stylesheet:

```css
:root {
  --primary: oklch(0.55 0.2 270);
  --primary-foreground: oklch(1 0 0);
  --card: oklch(0.98 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.55 0 0);
  --border: oklch(0.9 0 0);
  --ring: oklch(0.55 0.2 270);
}
```

---

## Adding shadcn to your app

If you want to start using shadcn in your own components (not required for Lume to work):

```bash
npx shadcn@latest init
```

Then add individual components as needed:

```bash
npx shadcn@latest add button card badge
```

Your installed components will automatically style-match Lume's UI since both use the same CSS variable conventions.
