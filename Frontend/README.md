# AuctionHub - Modern Online Auction Platform UI

A stunning, professional, and modern UI for an online auction system built with React 19, TailwindCSS 4, and Vite.

## 🎨 Design Features

- **Dark Theme** with electric indigo/purple accents
- **Glassmorphism** effects and smooth gradients
- **Micro-interactions** and smooth animations
- **Fully Responsive** - works beautifully on all devices
- **Accessible** - WCAG AA compliant
- **Modern Components** - Reusable and customizable

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── auction/         # Auction-specific components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html
└── package.json
```

## 🎯 Key Pages

### Public Pages
- **Landing Page** - Hero section with features and CTAs
- **Login Page** - User authentication with role selection
- **Register Page** - User registration with validation

### Bidder Pages
- **Dashboard** - Overview with stats and live auctions
- **Auctions List** - Browse all auctions with filters
- **Auction Detail** - View auction items and register
- **Item Bidding** - Place bids with real-time updates
- **My Auctions** - Track registered auctions

### Admin Pages
- **Admin Dashboard** - Platform overview and management
- **Create Auction** - Set up new auctions
- **Manage Auctions** - Edit and monitor auctions

## 🧩 Component Library

### UI Components
- `Button` - Multiple variants (primary, secondary, outline, ghost, destructive)
- `Card` - Flexible card with header, body, footer
- `Badge` - Status and category indicators
- `Input` - Form input with icons and validation
- `Select` - Dropdown with custom styling
- `Modal` - Overlay dialogs
- `Toast` - Notification messages
- `Tabs` - Tab navigation
- `Skeleton` - Loading placeholders
- `EmptyState` - No data states

### Auction Components
- `AuctionCard` - Display auction information
- `ItemCard` - Display item with bidding info
- `StatsCard` - Dashboard statistics

### Layout Components
- `Navbar` - Navigation with user menu

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1) to Purple (#8b5cf6) gradient
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 12px to 48px with clear hierarchy

### Spacing
- **Scale**: 4px, 8px, 16px, 24px, 32px, 48px

### Animations
- **Transitions**: 150ms (fast), 250ms (base), 350ms (slow)
- **Effects**: Hover lift, glow, pulse, shimmer

## 🔌 API Integration

The UI is designed to work with the Spring Boot backend. Update API endpoints in:
- `src/utils/api.js` (create this file)
- Use axios or fetch for API calls

Example:
```javascript
// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getAuctions = () => axios.get(`${API_BASE_URL}/auctions/upcoming`);
export const placeBid = (data) => axios.post(`${API_BASE_URL}/bids/placeBid`, data);
```

## 🎯 Usage Examples

### Using Components

```jsx
import { Button, Card, Badge } from './components';

function MyComponent() {
  return (
    <Card hover glass>
      <Card.Header>
        <h3>Auction Title</h3>
        <Badge variant="live" pulse>LIVE</Badge>
      </Card.Header>
      <Card.Body>
        <p>Auction content...</p>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Place Bid</Button>
      </Card.Footer>
    </Card>
  );
}
```

### Using Utilities

```jsx
import { formatCurrency, formatDateTime } from './utils/formatters';

const price = formatCurrency(50000); // ₹50,000
const date = formatDateTime('2026-01-21T18:00:00'); // January 21, 2026, 06:00 PM
```

## 🎨 Customization

### Changing Colors
Edit `src/styles/design-system.css`:
```css
:root {
  --color-accent-primary: #your-color;
  --color-accent-secondary: #your-color;
}
```

### Adding New Components
1. Create component in `src/components/ui/`
2. Export from `src/components/index.js`
3. Use throughout the app

## 📱 Responsive Design

- **Mobile**: < 768px - Stacked layout, hamburger menu
- **Tablet**: 768px - 1024px - 2-column grid
- **Desktop**: > 1024px - Full layout with sidebars

## ♿ Accessibility

- Keyboard navigation support
- Focus indicators on all interactive elements
- ARIA labels where needed
- High contrast text
- Screen reader friendly

## 🚀 Performance

- Lazy loading for images
- Code splitting by route
- Optimized animations (GPU-accelerated)
- Minimal bundle size

## 🔧 Tech Stack

- **React 19** - UI library
- **TailwindCSS 4** - Utility-first CSS
- **React Router 7** - Client-side routing
- **Vite 6** - Build tool
- **React Toastify** - Notifications

## 📝 License

MIT License - feel free to use this in your projects!

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and component patterns.

## 📞 Support

For issues or questions, please open a GitHub issue.
