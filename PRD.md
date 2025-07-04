# Mealzee Tiffin Service - Product Requirements Document (PRD)

## 1. Project Overview

### 1.1 Product Vision
Mealzee is a modern tiffin service platform that provides healthy, affordable, and delicious meal plans to customers. The platform offers flexible meal combinations with seamless ordering through WhatsApp integration.

### 1.2 Target Audience
- Working professionals seeking healthy meal options
- Students requiring affordable and nutritious meals
- Families looking for convenient meal solutions
- Health-conscious individuals wanting customized meal plans

### 1.3 Key Value Propositions
- Flexible meal plan combinations (Breakfast, Lunch, Dinner)
- Competitive pricing with attractive discounts
- Healthy and delicious food prepared by expert chefs
- Convenient WhatsApp-based ordering system
- Special features like birthday surprises and festival specials

## 2. Core Features

### 2.1 Meal Plans
**Four Main Combinations:**
1. **Breakfast + Lunch + Dinner** - ₹3399/month (12% off from ₹3899)
2. **Breakfast + Dinner** - ₹2899/month (17% off from ₹3499)
3. **Breakfast + Lunch** - ₹2899/month (17% off from ₹3499)
4. **Lunch + Dinner** - ₹2899/month (17% off from ₹3499)

### 2.2 Authentication System
- OTP-based login via email or phone number
- Secure user session management
- User profile management

### 2.3 Ordering System
- Location-based service availability
- Order customization options
- WhatsApp integration for order confirmation
- Admin notification system (Phone: 9608036638)

### 2.4 Special Features
- **Veg & Non-Veg Mode Toggle**
- **Healthy Options** - Nutritious meal selections
- **Birthday Surprise** - Special meals on birthdays
- **Gift Cards** - Purchasable gift vouchers
- **Festival Special** - Seasonal menu items
- **Joining Gift** - Welcome bonus for new users

## 3. Technical Specifications

### 3.1 Technology Stack
- **Frontend:** Next.js 15.3.3 with TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React & Heroicons
- **State Management:** React Context API

### 3.2 Key Components
- Hero section with video background
- Meal plan cards with pricing
- Authentication modal
- Features showcase grid
- Customer reviews marquee
- Order management system
- Footer with navigation

### 3.3 Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Accessible design patterns

## 4. User Experience Flow

### 4.1 Homepage Journey
1. **Hero Section** - Video background with compelling CTA
2. **Meal Plans** - Clear pricing and plan selection
3. **Features** - Showcase of unique offerings
4. **Reviews** - Social proof through testimonials
5. **Footer** - Login and order actions

### 4.2 Authentication Flow
1. Click "Login" button
2. Enter email/phone number
3. Receive and enter OTP
4. Access personalized dashboard

### 4.3 Ordering Flow
1. Select meal plan
2. Customize preferences (Veg/Non-Veg)
3. Confirm location
4. Review order details
5. Place order via WhatsApp
6. Receive confirmation

## 5. Enhanced Features (Future Scope)

### 5.1 Subscription Management
- Pause/resume subscriptions
- Modify meal plans
- Delivery schedule customization

### 5.2 Loyalty Program
- Points for regular orders
- Referral bonuses
- Tier-based benefits

### 5.3 Delivery Tracking
- Real-time order status
- Delivery notifications
- Feedback system

### 5.4 Nutritional Information
- Calorie tracking
- Ingredient lists
- Dietary restriction filters

## 6. Design Guidelines

### 6.1 Color Palette
- **Primary Green:** #22C55E (Mealzee brand color)
- **Secondary Yellow:** #FCD34D (Accent color)
- **Background:** #F8F9FA (Light gray)
- **Text:** #2D3436 (Dark gray)
- **Success:** #10B981
- **Warning:** #F59E0B

### 6.2 Typography
- **Headings:** Inter/System fonts, bold weights
- **Body:** Inter/System fonts, regular weights
- **Buttons:** Medium weight, proper contrast

### 6.3 Animation Principles
- Smooth transitions (300ms ease-in-out)
- Hover effects on interactive elements
- Marquee animations for reviews
- Parallax scrolling effects
- Micro-interactions for engagement

## 7. Performance Requirements

### 7.1 Loading Performance
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Cumulative Layout Shift < 0.1

### 7.2 Optimization Strategies
- Image optimization with Next.js Image component
- Lazy loading for non-critical content
- Code splitting for better performance
- Efficient bundle sizes

## 8. Integration Requirements

### 8.1 WhatsApp Integration
- Order details formatting
- Admin number: 9608036638
- Automated message templates
- Deep linking support

### 8.2 Location Services
- Geolocation API integration
- Service area validation
- Address autocomplete

## 9. Success Metrics

### 9.1 User Engagement
- Time spent on site
- Conversion rate from visitor to order
- User retention rate

### 9.2 Business Metrics
- Order completion rate
- Average order value
- Customer acquisition cost

## 10. Development Phases

### Phase 1: Core Features (Current)
- Hero section and meal plans
- Basic authentication
- Order flow with WhatsApp integration

### Phase 2: Enhanced UX
- Advanced animations
- Customer reviews system
- Performance optimizations

### Phase 3: Advanced Features
- Subscription management
- Loyalty program
- Analytics dashboard

---

**Document Version:** 1.0  
**Last Updated:** June 23, 2025  
**Next Review:** July 2025
