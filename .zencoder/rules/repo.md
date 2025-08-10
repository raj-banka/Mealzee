---
description: Repository Information Overview
alwaysApply: true
---

# Mealzee - Tiffin Service Website Information

## Summary
Mealzee is a modern, responsive tiffin service website built with Next.js, TypeScript, and Tailwind CSS. It offers healthy, affordable meal plans with WhatsApp-based ordering, OTP authentication via WhatsApp using Message Central, and location-based services.

## Structure
- **app/**: Next.js app directory with pages and layouts
- **components/**: UI components organized by functionality (auth, features, home, layout, order, ui)
- **contexts/**: React Context providers for state management
- **hooks/**: Custom React hooks for shared functionality
- **lib/**: Utility libraries and services
- **public/**: Static assets including images and icons
- **types/**: TypeScript type definitions
- **utils/**: Utility functions for various features

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.x
**Framework**: Next.js 15.3.3
**Node Requirement**: Node.js 18+
**Build System**: Next.js build system
**Package Manager**: npm/yarn/pnpm

## Dependencies
**Main Dependencies**:
- React 19.0.0 and React DOM 19.0.0
- Next.js 15.3.3
- Tailwind CSS 4.x
- Framer Motion 12.18.1
- React Hook Form 7.57.0
- Zod 3.25.64 (validation)
- Nodemailer 7.0.5 (email services)
- Redis 5.8.0 (caching)

**Development Dependencies**:
- ESLint 9.x
- TypeScript 5.x
- Tailwind CSS tooling

## Build & Installation
```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Main Features
**Core Features**:
- Hero section with food video background
- Meal plan cards with different combinations
- WhatsApp OTP verification using Message Central
- WhatsApp integration for order placement
- Location-based service with geolocation
- Customer reviews marquee

**WhatsApp OTP Verification**:
- Message Central integration for WhatsApp OTP
- Rate limiting and brute-force protection
- OTP expiry and attempt limiting
- React component for easy integration

## Configuration
**Environment Variables**:
- Message Central configuration for WhatsApp OTP
- Firebase configuration for authentication
- WhatsApp integration settings
- Application URLs and endpoints
- Restaurant information

**Next.js Configuration**:
- ESLint settings
- Image optimization with external domains
- Path aliases (@/* for src/*)

## Performance Optimizations
- Lazy loading for images and components
- Code splitting with dynamic imports
- Animation optimization based on device performance
- Caching for API responses and static assets
- Bundle optimization with tree shaking