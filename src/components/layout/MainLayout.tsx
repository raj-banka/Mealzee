'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import OrderFlowManager from '@/components/order/OrderFlowManager';
import OrderFlowIndicator from '@/components/ui/OrderFlowIndicator';

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showOrderFlow?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showFooter = true, 
  showOrderFlow = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Fixed Navbar */}
      <Navbar />
      
      {/* Order Flow Indicator */}
      {showOrderFlow && <OrderFlowIndicator />}
      
      {/* Main Content with proper top padding to account for fixed navbar (h-16 = 64px) */}
      <main className="pt-16" style={{ paddingTop: '64px' }}>
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
      
      {/* Global Order Flow Manager */}
      {showOrderFlow && <OrderFlowManager />}
    </div>
  );
};

export default MainLayout;
