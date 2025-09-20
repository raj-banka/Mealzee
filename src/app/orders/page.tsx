import React from 'react';
import OrderHistory from '@/components/orders/OrderHistory';
import MainLayout from '@/components/layout/MainLayout';

export const metadata = {
  title: 'My Orders',
  description: 'View my past orders',
};

export default function OrdersPage() {
  return (
    <MainLayout className="bg-gray-50" showOrderFlow={false}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track and review my previous orders</p>
        </div>

        <section>
          <OrderHistory />
        </section>
      </div>
    </MainLayout>
  );
}

