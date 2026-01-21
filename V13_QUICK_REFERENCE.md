# LotionGPT v13.0 Transcendental - Quick Reference Guide

## Getting Started with v13.0 Features

### 1. Import the Global Styles
Add to your app root or main layout:
```tsx
import '@/styles/globals.css';
```

### 2. Import New Components
```tsx
import {
  TranscendentalCard,
  ParticleField,
  VolumetricGlow,
  MorphingBlob,
  QuantumTunnel,
  HoloText
} from '@/components/ui/TranscendentalEffects';
```

---

## COMMON USE CASES

### Premium Card with 3D Effects
```tsx
<TranscendentalCard
  intensity="medium"
  enable3D={true}
  enableParticles={true}
  enableGlow={true}
  className="p-6 bg-[var(--color-bg-tertiary)]"
>
  <h2 className="text-xl font-bold">Premium Content</h2>
  <p>This card has 3D transforms and particle effects</p>
</TranscendentalCard>
```

### Holographic Text
```tsx
<HoloText intensity="strong" className="text-2xl">
  Transcendental Experience
</HoloText>
```

### Particle Background
```tsx
<div className="relative h-64">
  <ParticleField count={30} color="cosmic" />
  <div className="relative z-10">Content on top</div>
</div>
```

### Morphing Background Blob
```tsx
<div className="relative h-full">
  <MorphingBlob
    gradient="aurora"
    size="xl"
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  />
</div>
```

### Quantum Tunnel Transition
```tsx
<QuantumTunnel isActive={isTransitioning}>
  <YourComponent />
</QuantumTunnel>
```

---

## UTILITY CLASSES

### 3D Effects
```tsx
<div className="preserve-3d hover:animate-card-tilt">
  Content with 3D tilt on hover
</div>

<div className="transform-gpu hover:animate-depth-lift">
  GPU-accelerated depth lift
</div>
```

### Spring Animations
```tsx
<div className="animate-spring-in">
  Elastic entrance animation
</div>

<div className="animate-elastic-scale">
  Bouncy scale effect
</div>
```

### Particle Effects
```tsx
<div className="particle-swirl">
  Swirling particles
</div>
```

### Glow Effects
```tsx
<div className="shadow-glow-transcendental">
  Maximum glow effect
</div>

<h3 className="text-glow-plasma-v13">
  Plasma text glow
</h3>
```

### Glass Morphism
```tsx
<div className="glass-diamond-v13 p-4">
  Ultra-premium glass effect
</div>

<div className="glass-sapphire p-4">
  Sapphire glass variant
</div>
```

### Gradient Text
```tsx
<h2 className="gradient-text-hologram">
  Holographic gradient text
</h2>

<h2 className="gradient-text-vortex">
  Rotating vortex gradient
</h2>
```

### 3D Depth Layers
```tsx
<div className="depth-layer-1-v13">
  First depth layer
</div>

<div className="depth-layer-2-v13">
  Second depth layer
</div>
```

### Premium Cards
```tsx
<div className="premium-card-v13 p-6 bg-[var(--color-bg-tertiary)]">
  This card has 3D hover effects
</div>
```

### Buttons
```tsx
<button className="button-premium-v13 px-6 py-3 bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)]">
  Premium Button
</button>
```

---

## ANIMATION DELAYS & DURATIONS

### Delays
```tsx
<div className="animate-spring-in delay-75">
  75ms delay
</div>

<div className="animate-spring-in delay-1000">
  1000ms delay
</div>
```

### Durations
```tsx
<div className="duration-300">
  300ms duration
</div>

<div className="duration-700">
  700ms duration
</div>
```

---

## DESIGN TOKEN REFERENCE

### 3D Transforms
```css
transform: perspective(var(--perspective-normal)) translateZ(var(--depth-z-3));
```

### Spring Physics
```css
transition-timing-function: var(--ease-spring-3d);
```

### Glow Effects
```css
box-shadow: var(--glow-transcendental);
text-shadow: var(--text-glow-plasma);
```

### Gradients
```css
background: var(--gradient-ethereal);
background: var(--gradient-plasma);
background: var(--gradient-vortex);
```

### Particles
```css
background: var(--particle-quantum-1);
--tx: 100px; /* Translate X */
--ty: -100px; /* Translate Y */
```

---

## COMPONENT INTENSITY LEVELS

### TranscendentalCard Intensity
- `subtle` - Small scale (1.02), 2deg rotation, 10px translateZ
- `medium` - Medium scale (1.05), 5deg rotation, 20px translateZ
- `strong` - Large scale (1.08), 8deg rotation, 30px translateZ

### VolumetricGlow Intensity
- `subtle` - 60px spread
- `medium` - 100px spread
- `strong` - 160px spread

### HoloText Intensity
- `subtle` - Single layer glow
- `medium` - 2-layer glow
- `strong` - 3-layer multi-color glow

---

## COLOR SCHEMES

### ParticleField Colors
- `quantum` - Indigo/purple spectrum
- `cosmic` - Cyan/magenta/lime/gold
- `holo` - 4-color holographic

### MorphingBlob Gradients
- `aurora` - Northern lights spectrum
- `plasma` - Radial plasma field
- `holo` - Holographic colors
- `cyberpunk` - Pink/yellow/green

---

## SIZES

### MorphingBlob Sizes
- `sm` - 128x128px
- `md` - 192x192px
- `lg` - 256x256px
- `xl` - 320x320px

---

## TYPICAL IMPLEMENTATION PATTERNS

### Hero Section with Particles
```tsx
<section className="relative min-h-screen overflow-hidden">
  <ParticleField count={40} color="cosmic" />
  <div className="relative z-10 container mx-auto">
    <HoloText intensity="strong" className="text-6xl">
      Welcome to the Future
    </HoloText>
  </div>
</section>
```

### Premium Card Grid
```tsx
<div className="grid grid-cols-3 gap-6">
  {[1, 2, 3].map((i) => (
    <TranscendentalCard key={i} intensity="medium">
      <CardContent />
    </TranscendentalCard>
  ))}
</div>
```

### Animated List Items
```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-spring-in delay-100"
    style={{ animationDelay: `${i * 100}ms` }}
  >
    {item.content}
  </div>
))}
```

### Modal with Backdrop
```tsx
<div className="glass-diamond-v13 p-8 premium-card-v13">
  <VolumetricGlow intensity="medium" />
  <h2 className="text-glow-plasma-v13">Premium Modal</h2>
</div>
```

---

## PERFORMANCE TIPS

1. **Use sparingly**: Apply premium effects only to key interactive elements
2. **Will-change**: Add `will-change: transform` only for elements that will animate
3. **GPU acceleration**: Use `transform-gpu` class for complex animations
4. **Particle count**: Limit particles to 20-30 for best performance
5. **Backdrop filter**: Has performance cost, use `glass-premium` instead of `glass-ruby` for better performance

---

## ACCESSIBILITY

All v13.0 animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
  }
}
```

---

## MIGRATION GUIDE

### From v12.0 to v13.0

**Old:**
```tsx
<div className="premium-card shadow-lg">
```

**New:**
```tsx
<div className="premium-card-v13 shadow-glow-transcendental">
```

**Old:**
```tsx
<div className="animate-premium-entrance">
```

**New:**
```tsx
<div className="animate-spring-in">
```

**Old:**
```tsx
<div className="text-glow">
```

**New:**
```tsx
<div className="text-glow-plasma-v13">
```

---

## FILE LOCATIONS

- Animations: `/home/basti/projects/lotiongpt/src/styles/animations.css`
- Tokens: `/home/basti/projects/lotiongpt/src/styles/tokens.css`
- Utilities: `/home/basti/projects/lotiongpt/src/styles/globals.css`
- Components: `/home/basti/projects/lotiongpt/src/components/ui/TranscendentalEffects.tsx`
- Config: `/home/basti/projects/lotiongpt/tailwind.config.js`

---

## NEED HELP?

- See full changelog: `V13_CHANGELOG.md`
- Check component source: `src/components/ui/TranscendentalEffects.tsx`
- View animations: `src/styles/animations.css` (lines 1-4000+)

---

**Happy Coding with LotionGPT v13.0 Transcendental!** 🚀✨
