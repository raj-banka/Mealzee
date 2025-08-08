# 🍱 Mealzee - Tiffin Service Website

A modern, responsive tiffin service website built with Next.js, TypeScript, and Tailwind CSS. Mealzee offers healthy, affordable, and delicious meal plans with seamless WhatsApp-based ordering.

![Mealzee Banner](https://via.placeholder.com/1200x400/22C55E/FFFFFF?text=Mealzee+-+Better+Food+for+More+People)

## ✨ Features

### 🎯 Core Features
- **Hero Section** with attractive food video background
- **Meal Plan Cards** with 4 different combinations:
  - Breakfast + Lunch + Dinner (₹3399/month)
  - Breakfast + Dinner (₹2899/month)
  - Breakfast + Lunch (₹2899/month)
  - Lunch + Dinner (₹2899/month)
- **OTP-based Authentication** for email/phone
- **WhatsApp Integration** for order placement (Admin: 9204666105)
- **Location-based Service** with geolocation support
- **Customer Reviews Marquee** with alternating animations

### 🚀 Enhanced Features
- **Veg/Non-Veg Mode Toggle**
- **Special Features Section**:
  - Healthy meal options
  - Birthday surprises
  - Gift cards
  - Festival specials
  - Joining gifts
- **Subscription Management**
- **Loyalty Program** with points and rewards
- **Order Management System**
- **Performance Optimizations**

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React & Heroicons
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── auth/              # Authentication components
│   │   └── AuthModal.tsx  # OTP-based login modal
│   ├── features/          # Enhanced feature components
│   │   ├── LoyaltyProgram.tsx
│   │   └── SubscriptionManager.tsx
│   ├── home/              # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── MealPlans.tsx
│   │   ├── FeaturesSection.tsx
│   │   └── ReviewsMarquee.tsx
│   ├── layout/            # Layout components
│   │   └── Footer.tsx
│   ├── order/             # Order management
│   │   └── OrderModal.tsx
│   └── ui/                # Reusable UI components
├── utils/
│   ├── performance.ts     # Performance optimization utilities
│   └── whatsapp.ts        # WhatsApp integration
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd food
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette
- **Primary Green**: #22C55E (Mealzee brand color)
- **Secondary Yellow**: #FCD34D (Accent color)
- **Background**: #F8F9FA (Light gray)
- **Text**: #2D3436 (Dark gray)
- **Success**: #10B981
- **Warning**: #F59E0B

### Typography
- **Headings**: Inter/System fonts, bold weights
- **Body**: Inter/System fonts, regular weights
- **Buttons**: Medium weight, proper contrast

### Animations
- Smooth transitions (300ms ease-in-out)
- Hover effects on interactive elements
- Marquee animations for reviews
- Micro-interactions for engagement

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔧 Key Components

### HeroSection
- Video background with Mealzee branding
- Navigation header with login button
- Location-based service detection
- Call-to-action buttons

### MealPlans
- Interactive meal plan cards
- Pricing with discounts
- Order modal integration
- WhatsApp order placement

### FeaturesSection
- Veg/Non-Veg toggle functionality
- Feature grid with icons
- Hover animations
- Responsive layout

### ReviewsMarquee
- Alternating direction animations
- Customer testimonials
- Smooth infinite scroll
- Performance optimized

### AuthModal
- Multi-step OTP verification
- Email/Phone number support
- Form validation
- Success animations

### OrderModal
- Customer details collection
- Location detection
- Order confirmation
- WhatsApp integration

## 🔗 WhatsApp Integration

The website integrates with WhatsApp for order management:
- **Admin Number**: 9204666105
- **Order Details**: Automatically formatted messages
- **Customer Info**: Name, phone, email, address
- **Meal Plan**: Selected plan with pricing
- **Special Requests**: Custom preferences

## ⚡ Performance Optimizations

- **Lazy Loading**: Images and components
- **Code Splitting**: Dynamic imports
- **Animation Optimization**: Based on device performance
- **Caching**: API responses and static assets
- **Bundle Optimization**: Tree shaking and minification
- **Accessibility**: Reduced motion support

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Performance Metrics

Target performance metrics:
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and queries:
- **Email**: hello@mealzee.com
- **Phone**: +91 9204666105
- **WhatsApp**: [Chat with us](https://wa.me/919204666105)

## 🙏 Acknowledgments

- Design inspiration from modern food delivery platforms
- Icons from Lucide React
- Animations powered by Framer Motion
- Built with Next.js and Tailwind CSS

---

**Made with ❤️ for food lovers by the Mealzee team**
