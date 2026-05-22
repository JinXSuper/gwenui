# AI Chat Hero

Full-page AI chat interface hero block, Gemini-inspired with GwenUI dark tokens. It features a customizable sidebar, an interactive models dropdown, a dynamic chat input area that handles file uploads, suggestion chips with smooth tap and hover micro-interactions, and high-fidelity ambient light glow effects.

## Structure

Once added, the block is structured as follows:

```
ai-chat-hero/
├── index.tsx                # Main entry point (AIChatHero)
├── components/
│   ├── ChatSidebar.tsx      # Icon-only desktop sidebar
│   ├── ChatInput.tsx        # Pill-shaped chat input bar & menus
│   └── SuggestionChips.tsx  # Dynamic suggestion chips row
├── hooks/
│   └── useChatInput.ts      # Stdin/textarea state controller hook
└── block.json               # Block metadata configuration
```

## Usage

Import the component into your page:

```tsx
import AIChatHero from "@/components/blocks/ai-chat-hero";

export default function Page() {
  const handleSubmit = (value: string) => {
    console.log("Chat submitted:", value);
  };

  return (
    <AIChatHero
      headline="I'm Gwen, let's build our dreams together!"
      headlineAccent="Gwen"
      onSubmit={handleSubmit}
    />
  );
}
```

## Props Reference

| Prop | Type | Default / Fallback | Description |
| :--- | :--- | :--- | :--- |
| `headline` | `string` | `"I'm Gwen, lets build our dreams together!"` | The main hero greeting headline text. |
| `headlineAccent` | `string` | `"Gwen"` | Substring of the headline to apply the primary gradient glow effect to. |
| `placeholder` | `string` | `"Ask Gwen..."` | Input placeholder text. |
| `modelName` | `string` | `"Gwen 1.0 Supreme"` | Default active model name selected. |
| `chips` | `{ label: string; prompt: string }[]` | `4 default chips` | List of suggestion chips displayed above the input. |
| `avatarInitials` | `string` | `"JS"` | Capitalized initials displayed inside the user avatar circle. |
| `onSubmit` | `(value: string) => void` | `undefined` | Callback fired when the user submits a message. |
| `onChipClick` | `(prompt: string) => void` | `undefined` | Callback fired when a suggestion chip is clicked. |
| `onModelClick` | `() => void` | `undefined` | Callback fired when the model selector is clicked. |
| `onMicClick` | `() => void` | `undefined` | Callback fired when the microphone button is clicked. |
| `className` | `string` | `""` | Additional CSS class names to apply to the root container. |
| `fullscreen` | `boolean` | `false` | Fits the container to the parent viewport if true. |
