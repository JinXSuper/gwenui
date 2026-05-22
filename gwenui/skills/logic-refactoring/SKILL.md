---
name: logic-refactoring
description: React/TypeScript refactoring patterns — when to split components, dead code elimination, and performance optimization with useMemo, useCallback, and React.memo. Use when refactoring, reviewing, or cleaning up React code.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Logic Refactoring SKILL

## Overview

Standard guide for refactoring logic in React/TypeScript — when to split components,
dead code elimination, and performance optimization. Generic by default,
GwenUI-specific if the context is the GwenUI codebase.

---

## 1. When to Split Components

### Rules

Split a component if any of these conditions are met:

| Condition | Action |
|---------|--------|
| File > 150 lines | Split |
| There is a logically separate UI part | Split |
| A part is rendered repeatedly (list item) | Split |
| A part is reusable elsewhere | Split |
| Too much props drilling (3+ levels) | Split + restructure |
| Component has more than 1 responsibility | Split |

### DO NOT split if:
- The component is small and cohesive — splitting would introduce unnecessary overhead.
- It is only to reduce line count — if the logic remains coupled, splitting is useless.
- The sub-component will never be used elsewhere and is under 40 lines.

### Before vs After

```tsx
// ❌ Before — single component, too many responsibilities
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState([])
  const [notifications, setNotifications] = useState([])

  return (
    <div>
      {/* Header — 30 lines */}
      <header>
        <img src={user?.avatar} />
        <h1>{user?.name}</h1>
        <button onClick={() => setNotifications([])}>Clear</button>
        {notifications.map(n => <div key={n.id}>{n.message}</div>)}
      </header>

      {/* Stats grid — 40 lines */}
      <div className="grid grid-cols-3">
        {stats.map(stat => (
          <div key={stat.id}>
            <p>{stat.label}</p>
            <p>{stat.value}</p>
            <p>{stat.change > 0 ? "↑" : "↓"}{stat.change}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ After — split by responsibility
// dashboard-header.tsx
function DashboardHeader({ user, notifications, onClearNotifications }) { ... }

// stat-card.tsx
function StatCard({ label, value, change }) { ... }

// stats-grid.tsx
function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-3">
      {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
    </div>
  )
}

// dashboard.tsx — clean orchestrator
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState([])
  const [notifications, setNotifications] = useState([])

  return (
    <div>
      <DashboardHeader user={user} notifications={notifications} onClearNotifications={...} />
      <StatsGrid stats={stats} />
    </div>
  )
}
```

---

## 2. Dead Code Elimination

### Identifying Dead Code

```tsx
// 1. Unused imports
import { useState, useEffect, useRef, useCallback } from "react"
//                            ^^^^xx unused → delete

// 2. Unused variables
const [isLoading, setIsLoading] = useState(false)
// isLoading is never used in JSX → delete

// 3. Old commented-out code
// const oldHandler = () => { ... }  // ← delete if no longer relevant

// 4. Unreachable code
function Component({ isVisible }) {
  if (!isVisible) return null
  return (
    <div>
      {isVisible && <span>Always true here</span>}  {/* redundant check */}
    </div>
  )
}

// 5. Unused props
interface CardProps {
  title: string
  description: string
  onClick: () => void  // never passed → delete from interface
}
```

### Rules

- Delete all unused imports — TypeScript/ESLint usually flags these.
- Delete leftover debug `console.log` statements.
- Delete commented-out code that is no longer relevant — use Git for recovery if needed.
- Delete props from the interface if they are not used in the component body.
- Delete `useEffect` hooks with empty dependency arrays that have no cleanup or side effects.

### Before vs After

```tsx
// ❌ Before
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"  // unused

interface Props {
  title: string
  subtitle: string     // unused
  onClose: () => void  // unused
}

export function AlertBanner({ title }: Props) {
  const ref = useRef(null)  // unused
  const [count, setCount] = useState(0)  // unused

  useEffect(() => {
    console.log("mounted")  // debug log
  }, [])

  return <Button>{title}</Button>
}

// ✅ After
import { Button } from "@/components/ui/button"

interface Props {
  title: string
}

export function AlertBanner({ title }: Props) {
  return <Button>{title}</Button>
}
```

---

## 3. Performance Optimization

### Core Principles

> Do not optimize prematurely. Profile first, optimize later.
> `useMemo`, `useCallback`, and `React.memo` have overhead costs — use them only when necessary.

### `React.memo`

Use if the component:
- Re-renders frequently due to parent re-renders.
- Props rarely change.
- Render cost is high (long lists, heavy computations).

```tsx
// ❌ Do not memoize every component
const SimpleText = React.memo(({ text }: { text: string }) => <p>{text}</p>)
// Too simple, memoization overhead > benefit

// ✅ Memoize expensive components
const DataTable = React.memo(({ rows }: { rows: Row[] }) => {
  return (
    <table>
      {rows.map(row => <TableRow key={row.id} row={row} />)}
    </table>
  )
})
```

### `useCallback`

Use if:
- The function is passed as a prop to a memoized child component.
- The function is a dependency in a `useEffect` hook.

```tsx
// ❌ Not needed — not passed to a memoized child
function Form() {
  const handleChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])  // unnecessary
}

// ✅ Needed — passed to a React.memo component
function Parent() {
  const [items, setItems] = useState([])

  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])  // stable reference

  return <MemoizedList items={items} onDelete={handleDelete} />
}
```

### `useMemo`

Use if:
- There is a heavy computation that does not need to re-run on every render.
- Derived data from props/state is expensive to compute.

```tsx
// ❌ Not needed — lightweight computation
const doubled = useMemo(() => count * 2, [count])
// Sufficient: const doubled = count * 2

// ✅ Needed — filtering/sorting a large array
const filteredAndSorted = useMemo(() => {
  return data
    .filter(item => item.status === activeFilter)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, pageSize)
}, [data, activeFilter, pageSize])
```

### `useEffect` — Common Mistakes

```tsx
// ❌ Missing cleanup — memory leak
useEffect(() => {
  const subscription = store.subscribe(handler)
  // forgot to clean up!
}, [])

// ✅ With cleanup
useEffect(() => {
  const subscription = store.subscribe(handler)
  return () => subscription.unsubscribe()
}, [])

// ❌ Fetch in useEffect without abort
useEffect(() => {
  fetch("/api/data").then(r => r.json()).then(setData)
}, [id])

// ✅ With AbortController
useEffect(() => {
  const controller = new AbortController()
  fetch("/api/data", { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => { if (e.name !== "AbortError") setError(e) })
  return () => controller.abort()
}, [id])
```

---

## 4. General Refactoring Patterns

### Early Return — Reduce Nesting

```tsx
// ❌ Deeply nested
function UserCard({ user }) {
  if (user) {
    if (user.isActive) {
      if (user.role === "admin") {
        return <AdminBadge />
      } else {
        return <UserBadge />
      }
    } else {
      return <InactiveBadge />
    }
  } else {
    return null
  }
}

// ✅ Early return
function UserCard({ user }) {
  if (!user) return null
  if (!user.isActive) return <InactiveBadge />
  if (user.role === "admin") return <AdminBadge />
  return <UserBadge />
}
```

### Derived State — Do Not Duplicate State

```tsx
// ❌ State that can be derived
const [items, setItems] = useState([])
const [itemCount, setItemCount] = useState(0)  // duplicate!

// ✅ Derive from existing state
const [items, setItems] = useState([])
const itemCount = items.length  // derived, always in sync
```

### Consolidate Related State

```tsx
// ❌ Separate states that always update together
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)

// ✅ Consolidate into a single object
const [fetchState, setFetchState] = useState<{
  status: "idle" | "loading" | "success" | "error"
  data: Data | null
  error: Error | null
}>({ status: "idle", data: null, error: null })
```

---

## GwenUI-Specific Rules

Applies if the refactoring context is the GwenUI codebase:

- **Block files > 150 lines** → must split into `components/` subfolder.
- **Reusable logic between sub-components** → extract to `hooks/` subfolder.
- **No absolute imports** outside the block folder.
- **No global state** — all state must be local.
- **Framer Motion variants** → extract to a separate object outside the component, not inline.
- **CSS tokens** → all colors must use tokens, no hardcoding.

```tsx
// ❌ GwenUI — inline variants
<motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }}>

// ✅ GwenUI — extracted variants
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

<motion.div variants={fadeUp} initial="initial" animate="animate">
```

---

## Refactoring Checklist

- [ ] Component > 150 lines → split?
- [ ] Unused imports → deleted?
- [ ] Unused state/variables → deleted?
- [ ] Debug `console.log` statements → deleted?
- [ ] Old commented-out code → deleted?
- [ ] `useMemo`/`useCallback` used only when necessary?
- [ ] `useEffect` has cleanup if a subscription/listener exists?
- [ ] No duplicate state that can be derived instead?
- [ ] Early return used to reduce nesting?
- [ ] Props interface has no unused props?
