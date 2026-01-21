# Premium UI Components - Quick Start Guide

## Import Patterns

### Single Component Import
```tsx
import { PremiumButton } from '@/components/ui';
```

### Multiple Components Import
```tsx
import {
  PremiumCard,
  PremiumCardHeader,
  PremiumButton,
  PremiumInput,
} from '@/components/ui';
```

---

## Component Quick Reference

### Buttons

#### Primary Button
```tsx
<PremiumButton variant="primary" size="md">
  Click Me
</PremiumButton>
```

#### Gradient Button with Glow
```tsx
<PremiumButton variant="gradient" glow>
  Premium Action
</PremiumButton>
```

#### Icon Button
```tsx
<PremiumIconButton icon={<Icon />} tooltip="Description" />
```

### Cards

#### Glass Card with Hover
```tsx
<PremiumCard variant="glass" hover glow>
  <PremiumCardHeader
    title="Card Title"
    description="Optional description"
    icon={<Icon />}
  />
  <p>Card content here</p>
  <PremiumCardFooter>
    <p>Footer content</p>
  </PremiumCardFooter>
</PremiumCard>
```

#### Neon Card
```tsx
<PremiumCard variant="neon" glow>
  Content with glowing border
</PremiumCard>
```

### Inputs

#### Default Input
```tsx
<PremiumInput
  label="Email"
  type="email"
  placeholder="you@example.com"
/>
```

#### Input with Icon
```tsx
<PremiumInput
  label="Search"
  icon={<SearchIcon />}
  placeholder="Search..."
/>
```

#### Glass Textarea
```tsx
<PremiumTextarea
  variant="glass"
  label="Message"
  autoResize
/>
```

### Badges & Pills

#### Badge with Dot
```tsx
<PremiumBadge variant="success" dot>
  Active
</PremiumBadge>
```

#### Gradient Badge
```tsx
<PremiumBadge variant="gradient" icon={<Icon />}>
  Premium
</PremiumBadge>
```

#### Neon Pill
```tsx
<PremiumPill variant="glow" color="accent">
  Featured
</PremiumPill>
```

### Layout

#### Premium Layout
```tsx
<PremiumLayout showBackground>
  <PremiumContainer size="lg">
    {children}
  </PremiumContainer>
</PremiumLayout>
```

#### Grid System
```tsx
<PremiumGrid cols={3} gap="xl">
  <PremiumCard>Item 1</PremiumCard>
  <PremiumCard>Item 2</PremiumCard>
  <PremiumCard>Item 3</PremiumCard>
</PremiumGrid>
```

#### Flex Layout
```tsx
<PremiumFlex justify="between" align="center" gap="md">
  <div>Left</div>
  <div>Right</div>
</PremiumFlex>
```

### Effects

#### Glass Panel
```tsx
<GlassPanel intensity="strong" border shadow>
  Content with glassmorphism
</GlassPanel>
```

#### Gradient Border
```tsx
<GradientBorder variant="medium" animated>
  Content with animated border
</GradientBorder>
```

#### Glow Border
```tsx
<GlowBorder color="accent" intensity="strong">
  Content with glow
</GlowBorder>
```

### Micro-interactions

#### Hover Lift
```tsx
<HoverLift lift="md" shadow>
  <div>Lifts on hover</div>
</HoverLift>
```

#### Scale on Hover
```tsx
<ScaleOnHover scale={1.05}>
  <div>Scales on hover</div>
</ScaleOnHover>
```

#### Press Effect
```tsx
<PressEffect scale={0.95}>
  <button>Scales on press</button>
</PressEffect>
```

#### Ripple Effect
```tsx
<RippleEffect color="rgba(99, 102, 241, 0.3)">
  <button>Material ripple</button>
</RippleEffect>
```

#### Magnetic Effect
```tsx
<MagneticEffect strength={20}>
  <div>Follows mouse</div>
</MagneticEffect>
```

#### Glow on Hover
```tsx
<GlowOnHover color="accent" intensity="strong">
  <div>Glowing content</div>
</GlowOnHover>
```

### Animations

#### Typing Effect
```tsx
<TypingEffect text="Hello, World!" speed={50} />
```

#### Count Up Animation
```tsx
<CountUp end={1000} duration={2000} decimals={0} />
```

#### Border Beam
```tsx
<BorderBeam size={200} duration={15}>
  <div>Rotating border beam</div>
</BorderBeam>
```

### Backgrounds

#### Animated Background
```tsx
<AnimatedBackground />
```

#### Noise Texture
```tsx
<NoiseTexture opacity={0.04} />
```

#### Aurora Background
```tsx
<AuroraBackground variant="elite" animated />
```

#### Gradient Orbs
```tsx
<GradientOrb color="accent" size="lg" blur="lg" animated />
```

---

## Variant Options

### Button Variants
- `primary` - Gradient primary button
- `secondary` - Outlined secondary button
- `ghost` - Transparent ghost button
- `neon` - Glowing neon button
- `gradient` - Animated gradient button

### Card Variants
- `default` - Elevated card
- `glass` - Glassmorphism card
- `elevated` - High elevation card
- `neon` - Glowing neon card

### Input Variants
- `default` - Standard input
- `glass` - Glassmorphism input
- `neon` - Glowing input

### Badge Variants
- `default` - Neutral badge
- `success` - Green success badge
- `warning` - Yellow warning badge
- `error` - Red error badge
- `info` - Blue info badge
- `neon` - Glowing neon badge
- `gradient` - Animated gradient badge

### Size Options
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

---

## Utility Classes

### Hover Effects
- `hover-lift-sm` - Small lift on hover
- `hover-lift-md` - Medium lift on hover
- `hover-lift-lg` - Large lift on hover
- `hover-scale-up` - Scale up on hover
- `hover-glow-accent` - Glow on hover

### Animation Classes
- `animate-float` - Floating animation
- `animate-float-slow` - Slow float
- `animate-float-gentle` - Gentle float
- `animate-pulse-subtle` - Subtle pulse
- `animate-gradient-shift` - Gradient animation
- `animate-shimmer` - Shimmer effect
- `animate-shimmer-slow` - Slow shimmer

### Glass Effects
- `glass` - Light glass
- `glass-strong` - Strong glass
- `glass-heavy` - Heavy glass
- `glass-crystal` - Crystal glass

### Focus Styles
- `focus-ring-enhanced` - Premium focus ring
- `focus-visible-ring` - Visible focus ring

---

## Common Patterns

### Modal with Glass Effect
```tsx
<div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
  <GlassPanel intensity="strong" border shadow className="relative z-10">
    <PremiumCardHeader title="Modal Title" />
    {children}
  </GlassPanel>
</div>
```

### Loading State
```tsx
<PremiumButton loading>
  Loading...
</PremiumButton>
```

### Form with Validation
```tsx
<PremiumInput
  label="Email"
  type="email"
  error={errors.email}
  required
/>
```

### Responsive Grid
```tsx
<PremiumGrid cols={3} gap="lg">
  {/* Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
</PremiumGrid>
```

---

## Best Practices

1. **Use Semantic Variants** - Choose the variant that matches the content's purpose
2. **Consistent Spacing** - Use the `gap` prop instead of manual margins
3. **Accessibility First** - Always include labels and ARIA attributes
4. **Performance** - Use lazy loading for heavy components
5. **Responsive Design** - Test on all screen sizes
6. **Reduced Motion** - Respect user preferences

---

## TypeScript Support

All components are fully typed. Use the provided interfaces:

```tsx
interface MyComponentProps {
  variant: 'default' | 'glass' | 'neon';
  size?: 'sm' | 'md' | 'lg';
}
```

---

## Examples from the Codebase

### Chat Input with Premium Styling
```tsx
<div className="relative">
  <PremiumTextarea
    variant="glass"
    placeholder="Type a message..."
    autoResize
  />
  <div className="absolute right-4 bottom-4">
    <PremiumIconButton icon={<SendIcon />} variant="glow" />
  </div>
</div>
```

### Message Card with Effects
```tsx
<HoverLift>
  <PremiumCard variant="glass" hover>
    <PremiumCardHeader
      title="Message Title"
      icon={<MessageIcon />}
    />
    <p className="text-[var(--color-text-secondary)]">
      Message content here...
    </p>
  </PremiumCard>
</HoverLift>
```

### Settings Card
```tsx
<PremiumGrid cols={2} gap="md">
  <PremiumCard variant="default">
    <PremiumCardHeader title="Appearance" />
    {/* Settings options */}
  </PremiumCard>
  <PremiumCard variant="default">
    <PremiumCardHeader title="Notifications" />
    {/* Settings options */}
  </PremiumCard>
</PremiumGrid>
```

---

## Need Help?

Check the full documentation in `FRONTEND_IMPROVEMENTS.md` for detailed information about each component and feature.
