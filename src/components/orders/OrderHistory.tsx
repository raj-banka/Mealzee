"use client";
import React, { useEffect, useState } from "react";
// use built-in date formatting to avoid extra dependency
// import SmartImage from '@/components/ui/SmartImage';
import SmartImage from "../ui/SmartImage";

// Helper: create 5 demo orders for local dev/demo when APIs are not present
function createDummyOrders(): Order[] {
  const now = Date.now();
  const sampleItems = [
    { name: 'Veg Thali', price: 120, image: '/images/vegthali.jpg' },
    { name: 'Paneer Butter Masala', price: 180, image: '/images/nan-paner.jpg' },
    { name: 'Biryani', price: 210, image: '/images/biryani.jpg' },
    { name: 'Aalu Paratha', price: 90, image: '/images/aalu paratha.jpg' },
    { name: 'Kadhi Chawal', price: 95, image: '/images/kadhi-chawal.jpg' },
  ];

  const orders: Order[] = Array.from({ length: 5 }).map((_, i) => {
    const items = [
      { ...sampleItems[i % sampleItems.length], qty: 1 },
      { ...sampleItems[(i + 1) % sampleItems.length], qty: 2 },
    ];
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    return {
      id: String(1000 + i),
      createdAt: new Date(now - i * 1000 * 60 * 60 * 24).toISOString(),
      status: 'Delivered',
      items: items.map(it => ({ name: it.name, qty: it.qty, price: it.price, image: it.image })),
      total,
      eta: null,
    };
  });

  return orders;
}

export type Order = {
  id: string;
  createdAt: string;
  status: string;
  items: { name: string; qty: number; price: number; image?: string }[];
  total: number;
  eta?: string | null;
};

const OrderCard: React.FC<{ order: Order; onTrack: (id: string) => void }> = ({ order, onTrack }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-start">
      <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
        <SmartImage src={order.items[0]?.image || '/pic.png'} alt={order.items[0]?.name || 'Meal'} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">Order #{order.id}</h3>
            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">₹{order.total.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{order.status}</div>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-700">
          {order.items.slice(0,3).map((it, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="truncate">{it.qty} x {it.name}</div>
              <div className="text-gray-500">₹{(it.price * it.qty).toFixed(2)}</div>
            </div>
          ))}
          {order.items.length > 3 && <div className="text-xs text-gray-400">+{order.items.length - 3} more items</div>}
        </div>

        {/* Track and Share actions removed per request */}
      </div>
    </div>
  );
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [pageSize, setPageSize] = useState(4);

  // Page size: show 4 orders by default (mobile and desktop)
  useEffect(() => {
    const updateSize = () => {
      // Always show 4 items per page as requested (mobile included)
      setPageSize(4);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Prefer real API if available
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          // Fallback to localStorage (or seed demo orders if none exist)
          const cached = JSON.parse(localStorage.getItem('mealzee_orders') || '[]');
          if (!cached || !cached.length) {
            const demo = createDummyOrders();
            localStorage.setItem('mealzee_orders', JSON.stringify(demo));
            setOrders(demo);
          } else {
            setOrders(cached);
          }
        }
      } catch (e) {
        const cached = JSON.parse(localStorage.getItem('mealzee_orders') || '[]');
        if (!cached || !cached.length) {
          const demo = createDummyOrders();
          localStorage.setItem('mealzee_orders', JSON.stringify(demo));
          setOrders(demo);
        } else {
          setOrders(cached);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrack = (id: string) => {
    // Navigate to order tracking page or open modal — for now, open new tab to order detail
    window.open(`/orders/${id}`, '_blank');
  };

  if (loading) return <div className="py-8 text-center">Loading orders…</div>;
  if (!orders.length) return <div className="py-8 text-center text-gray-500">You have no past orders yet.</div>;

  const visible = showAll ? orders : orders.slice(0, pageSize);

  return (
    <div>
      <div className="space-y-4">
        {visible.map((o) => (
          <OrderCard key={o.id} order={o} onTrack={handleTrack} />
        ))}
      </div>

      {orders.length > pageSize && (
        <div className="mt-4 text-center">
          <button
            className="text-sm text-emerald-600 font-medium hover:underline"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? 'Show Less' : `View All (${orders.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
