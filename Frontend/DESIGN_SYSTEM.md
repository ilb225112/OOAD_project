# AuctionHub Design System Documentation

## 🎨 Design Philosophy

AuctionHub features a **modern, professional, and visually stunning** UI that combines elegance with functionality. The design language emphasizes:

- **Dark theme** with electric accent colors for a premium feel
- **Glassmorphism** and subtle gradients for depth
- **Smooth animations** and micro-interactions for engagement
- **Clear hierarchy** and generous white space for readability
- **Responsive design** that works beautifully across all devices

---

## 🎨 Color Palette

### Background Colors
```css
--color-bg-primary: #0a0e1a      /* Main background */
--color-bg-secondary: #131827    /* Secondary background */
--color-bg-tertiary: #1a1f35     /* Tertiary background */
--color-bg-card: #1e2438         /* Card background */
--color-bg-hover: #252b45        /* Hover states */
```

### Accent Colors
```css
--color-accent-primary: #6366f1   /* Indigo - Primary actions */
--color-accent-secondary: #8b5cf6 /* Purple - Secondary accents */
--color-accent-glow: rgba(99, 102, 241, 0.3) /* Glow effects */
```

### Status Colors
```css
--color-success: #10b981   /* Emerald - Success, Live, Available */
--color-warning: #f59e0b   /* Amber - Warnings */
--color-error: #ef4444     /* Red - Errors, Sold */
--color-info: #3b82f6      /* Blue - Info, Upcoming */
```

### Text Colors
```css
--color-text-primary: #f8fafc     /* Primary text */
--color-text-secondary: #cbd5e1   /* Secondary text */
--color-text-muted: #64748b       /* Muted text */
```

### Category Colors
- **Cricket**: Orange (#f97316)
- **Antiques**: Amber (#f59e0b)
- **Real Estate**: Cyan (#06b6d4)
- **Kabaddi**: Pink (#ec4899)

---

## 📐 Spacing System

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
```

---

## 🔤 Typography

### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Fallback**: System fonts for optimal performance

### Font Sizes
- **H1**: 3rem (48px) - Page titles
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.5rem (24px) - Card titles
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Labels, captions
- **Tiny**: 0.75rem (12px) - Metadata

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

---

## 🎯 Border Radius

```css
--radius-sm: 0.375rem   /* 6px - Small elements */
--radius-md: 0.5rem     /* 8px - Buttons, inputs */
--radius-lg: 0.75rem    /* 12px - Cards */
--radius-xl: 1rem       /* 16px - Large cards */
--radius-2xl: 1.5rem    /* 24px - Hero sections */
```

---

## 🌟 Shadows & Effects

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6)
--shadow-glow: 0 0 20px var(--color-accent-glow)
```

### Glassmorphism
```css
background: rgba(30, 36, 56, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 🎬 Animations & Transitions

### Transition Speeds
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Key Animations
- **Pulse**: For live status indicators
- **Shimmer**: For loading states
- **Card Lift**: Hover effect on cards (translateY(-4px))
- **Glow**: Hover glow effect on interactive elements

---

## 🧩 Component Library

### 1. Button Component

**Variants:**
- `primary`: Gradient indigo-to-purple, main CTAs
- `secondary`: Solid slate, secondary actions
- `outline`: Border only, tertiary actions
- `ghost`: Transparent, minimal actions
- `destructive`: Red, dangerous actions
- `success`: Emerald, positive actions

**Sizes:**
- `sm`: Small (px-3 py-1.5)
- `md`: Medium (px-4 py-2) - Default
- `lg`: Large (px-6 py-3)
- `xl`: Extra Large (px-8 py-4)

**States:**
- Default
- Hover (enhanced shadow, color shift)
- Active (pressed state)
- Disabled (50% opacity)
- Loading (spinner icon)

**Usage:**
```jsx
<Button variant="primary" size="lg" loading={false}>
  Place Bid
</Button>
```

---

### 2. Card Component

**Features:**
- Glass effect option
- Hover lift animation
- Glow effect option
- Modular sections (Header, Body, Footer)

**Usage:**
```jsx
<Card hover glass glow>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

### 3. Badge Component

**Variants:**
- `live`: Emerald with pulse animation
- `upcoming`: Blue
- `completed`: Gray
- `sold`: Red
- `available`: Emerald
- Category badges (cricket, antiques, real_estate, kabaddi)

**Sizes:**
- `sm`: Small
- `md`: Medium - Default
- `lg`: Large

**Usage:**
```jsx
<Badge variant="live" pulse size="md">
  LIVE
</Badge>
```

---

### 4. Input Component

**Features:**
- Label support
- Icon support (left-aligned)
- Error state with message
- Focus ring (indigo)
- Disabled state

**Usage:**
```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  icon={<EmailIcon />}
  error="Invalid email"
/>
```

---

### 5. StatsCard Component

**Features:**
- Large value display
- Icon with gradient background
- Trend indicator (up/down)
- Color variants (indigo, emerald, blue, amber, pink)
- Loading state

**Usage:**
```jsx
<StatsCard
  title="Live Auctions"
  value={8}
  icon={<LightningIcon />}
  color="emerald"
  trend="up"
  trendValue="+3 today"
/>
```

---

### 6. AuctionCard Component

**Features:**
- Status badge (live/upcoming/completed)
- Type badge (category)
- Gradient header with pattern
- Hover lift effect
- Date/time display
- Item count
- CTA button

**Usage:**
```jsx
<AuctionCard auction={auctionData} />
```

---

### 7. ItemCard Component

**Features:**
- Image placeholder with icon
- Status badge
- Sold overlay
- Price display (starting, current, final)
- Hover effects
- Conditional CTA based on status

**Usage:**
```jsx
<ItemCard 
  item={itemData} 
  auctionId={1}
  auctionStatus="LIVE"
/>
```

---

### 8. Navbar Component

**Features:**
- Sticky positioning
- Glassmorphism background
- Logo with gradient
- Navigation links with icons
- Notification bell
- Profile dropdown
- Mobile responsive menu

**Usage:**
```jsx
<Navbar 
  user={{ name: 'John Doe', email: 'john@example.com' }}
  onLogout={handleLogout}
/>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Responsive Patterns
- **Cards**: Stack vertically on mobile, grid on desktop
- **Navigation**: Hamburger menu on mobile, full nav on desktop
- **Sidebars**: Collapse on mobile, visible on desktop
- **Tables**: Horizontal scroll on mobile, full view on desktop

---

## ♿ Accessibility

### Focus States
- 2px solid indigo ring
- 2px offset for visibility
- Applied to all interactive elements

### Color Contrast
- All text meets WCAG AA standards
- Minimum 4.5:1 contrast ratio for body text
- Minimum 3:1 for large text

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators on all interactive elements
- Escape key closes modals

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Alt text for images

---

## 🎭 Interaction Patterns

### Hover States
- **Cards**: Lift + enhanced shadow + glow
- **Buttons**: Color shift + shadow enhancement
- **Links**: Color change + underline
- **Icons**: Scale up slightly

### Loading States
- **Buttons**: Spinner icon replaces content
- **Cards**: Shimmer animation
- **Data**: Skeleton screens

### Empty States
- Large icon (opacity 50%)
- Descriptive message
- Optional CTA

### Toasts/Notifications
- Top-right positioning
- Auto-dismiss after 5 seconds
- Color-coded by type (success, error, info, warning)
- Slide-in animation

---

## 🎨 Page Layouts

### 1. Landing Page
- Hero section with gradient background
- Animated background elements
- Feature grid (4 columns)
- Stats section
- CTA section
- Footer

### 2. Dashboard (Bidder)
- Welcome header
- Stats grid (4 cards)
- Live auctions (2/3 width)
- Activity feed (1/3 width)
- Quick actions sidebar

### 3. Dashboard (Admin)
- Header with quick actions
- Stats grid (5 cards)
- Auctions table (2/3 width)
- Quick actions + health (1/3 width)

### 4. Auction Detail
- Back button
- Auction header card (full width)
- Tabs (Items, Overview, Rules)
- Items grid (3 columns)
- Filters and search

### 5. Item Bidding
- Back button
- Item image + details (2/3 width)
- Bidding panel (1/3 width, sticky)
- Bid history
- Auction info card

### 6. Login/Register
- Centered card
- Logo at top
- User type toggle
- Form fields
- Social login options (optional)
- Footer link to alternate action

---

## 🚀 Performance Optimizations

### CSS
- Use CSS custom properties for theming
- Minimize repaints with transform/opacity
- Use will-change for animated elements

### Images
- Lazy loading for images
- Placeholder backgrounds
- WebP format with fallbacks

### Animations
- Use transform and opacity (GPU-accelerated)
- Reduce motion for accessibility
- Debounce scroll/resize events

---

## 📦 Component File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   └── StatsCard.jsx
│   ├── auction/
│   │   ├── AuctionCard.jsx
│   │   └── ItemCard.jsx
│   └── layout/
│       └── Navbar.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── BidderDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── AuctionDetailPage.jsx
│   └── ItemBiddingPage.jsx
└── styles/
    └── design-system.css
```

---

## 🎯 Best Practices

### Do's ✅
- Use consistent spacing from the spacing system
- Apply hover states to all interactive elements
- Provide loading states for async actions
- Use semantic HTML elements
- Test on multiple screen sizes
- Ensure keyboard navigation works
- Provide clear error messages

### Don'ts ❌
- Don't use arbitrary spacing values
- Don't forget focus states
- Don't use low-contrast colors
- Don't block the UI during loading
- Don't use generic error messages
- Don't ignore mobile users
- Don't overuse animations

---

## 🔄 Future Enhancements

- Dark/Light theme toggle
- Custom theme builder
- More animation presets
- Additional component variants
- Advanced data visualization
- Drag-and-drop interfaces
- Real-time collaboration features

---

## 📞 Support

For questions or suggestions about the design system:
- Review this documentation
- Check component examples in Storybook (if available)
- Consult with the design team
- Submit feedback via GitHub issues

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained by**: AuctionHub Design Team
