# FinanceAI - UI/UX Guide

## Color Palette

### Primary Colors
- **Background Primary**: `#0a0e14` - Darkest background
- **Background Secondary**: `#131820` - Section backgrounds
- **Background Elevated**: `#1f2631` - Cards and modals
- **Surface**: `#252d38` - Interactive elements

### Action Colors
- **Primary Blue**: `#4a90e2` - Main actions, links
- **Accent Green**: `#50c878` - Success, savings, positive
- **Warning Yellow**: `#f5a623` - Alerts, important notices
- **Danger Red**: `#e85d75` - Errors, deletions

### Text Colors
- **Primary**: `#e4e7eb` - Main text
- **Secondary**: `#9ca3af` - Descriptions
- **Tertiary**: `#6b7280` - Subtle text

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Heading Sizes
- **H1**: 32px-64px, weight: 700
- **H2**: 28px-40px, weight: 700
- **H3**: 20px-24px, weight: 600
- **H4**: 16px-18px, weight: 600

### Body Text
- **Large**: 16px
- **Base**: 14-15px
- **Small**: 13px
- **Tiny**: 11-12px

## Spacing & Layout

### Padding
- **None**: 0
- **Small**: 16px
- **Medium**: 24px
- **Large**: 32px

### Border Radius
- **Small**: 8px - Buttons, inputs
- **Medium**: 12px - Cards
- **Large**: 16px - Modals

### Shadows
- **Small**: `0 1px 2px rgba(0, 0, 0, 0.3)`
- **Medium**: `0 4px 12px rgba(0, 0, 0, 0.4)`
- **Large**: `0 8px 24px rgba(0, 0, 0, 0.5)`

## Animation Timings

### Durations
- **Fast**: 150ms - Quick hover effects
- **Base**: 250ms - Standard transitions
- **Slow**: 400ms - Page transitions

### Easing
```css
cubic-bezier(0.4, 0, 0.2, 1) /* Ease-in-out */
```

## Component Patterns

### Buttons
- **Primary**: Blue background, white text
- **Secondary**: Gray background
- **Accent**: Green background (success actions)
- **Outline**: Transparent with border
- **Ghost**: Transparent, subtle hover

### Cards
- Elevated background
- 1px border with subtle color
- 12px border radius
- Hover: Lift effect with border color change
- Padding: 24px default

### Modals
- Backdrop blur with dark overlay
- Scale and fade animation
- 16px border radius
- Max 90vh/90vw
- Close button in header

### Inputs
- Surface background
- Border on focus with primary color
- 8px border radius
- 12-16px padding

## Icon Usage

### Sources
Using **Lucide React** for all icons - mature, consistent, professional.

### Common Icons
- **Wallet**: Wallet connection
- **Sparkles**: AI features
- **Shield**: Security, blockchain
- **TrendingUp/Down**: Statistics
- **Plus**: Add actions
- **Edit2**: Edit actions
- **Trash2**: Delete actions
- **Settings**: User settings
- **Search**: Search functionality

### Sizes
- **Small**: 16px
- **Medium**: 20px
- **Large**: 24px
- **Extra Large**: 28px

## Page-Specific Animations

### Landing Page
- Animated background orbs (blur effect)
- Staggered feature card entrance
- Floating demo preview
- Scan lines effect

### Dashboard
- Stats cards fade in with stagger
- Progress bars animate from 0 to value
- Chart bars grow from bottom
- Smooth month selector slide

### Transactions
- Table rows fade in sequentially
- Hover row highlight
- Floating action button pulse
- Smooth modal slide-in

### Onboarding
- Progress bar smooth width animation
- Step content slide transition
- Selection cards scale on click
- Checkmark pop animation

### Budget
- Slider handles smooth drag
- Budget bars animate on change
- Suggestion cards slide in
- Apply button success pulse

### Agents
- Grid stagger entrance
- Toggle switch smooth slide
- Payment modal scale in
- Active agents badge pulse

### Insights
- Timeline vertical reveal
- Timeline dots pulse on hover
- Cards expand for details
- Accept/dismiss slide out

### Settings
- Toggle switches smooth slide
- Section expansion animation
- Save confirmation toast
- Delete modal shake effect

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Stack elements vertically */
  /* Hide desktop nav, show hamburger */
}

/* Tablet */
@media (max-width: 768px) {
  /* Adjust grid columns */
  /* Smaller text sizes */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full layout */
  /* Sidebar navigation */
}
```

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate
- Escape to close modals
- Arrow keys for sliders

### Focus States
- 2px outline with primary color
- 2px offset from element
- Visible on all interactive elements

### ARIA Labels
- Buttons have descriptive labels
- Inputs have associated labels
- Modals have role="dialog"
- Toast notifications use role="alert"

## Performance

### Animation Performance
- Use `transform` and `opacity` for animations
- Avoid animating `height`, `width` directly
- Use `will-change` sparingly
- Disable animations for `prefers-reduced-motion`

### Image Optimization
- Lazy load below fold
- Use appropriate formats (WebP)
- Provide alt text
- Compress assets

### Code Splitting
- Lazy load routes
- Dynamic imports for heavy components
- Tree shake unused code

## Best Practices

### Do's ✅
- Use consistent spacing
- Maintain color hierarchy
- Provide loading states
- Show error messages clearly
- Keep animations subtle
- Test on multiple devices
- Use semantic HTML

### Don'ts ❌
- No gradients on backgrounds
- No emoji in production UI
- No 3D effects or skeuomorphism
- No excessive animations
- No cluttered layouts
- No unclear error states
- No inaccessible controls

---

**Note**: This guide ensures consistency across the entire application. All new components should follow these patterns.
