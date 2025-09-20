"use client";
import React, { useEffect, useState } from "react";
import { useApp } from '@/contexts/AppContext';
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

// Format date as DD-MM-YYYY (date-month-year)
const formatDateDMY = (iso: string) => {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  } catch {
    return iso;
  }
};

const formatDateOnly = (iso: string) => {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return iso;
  }
};

// Safely compute display name for an order item (handles item, nested dish or plan)
const getDisplayName = (item: any) => {
  if (!item) return '';
  return item.name ?? item.dish?.name ?? item.plan?.title ?? '';
};

// Return numeric price for an item with fallbacks
const getItemPrice = (item: any) => {
  if (!item) return 0;
  const p = item.price ?? item.dish?.price ?? item.plan?.discountedPrice ?? item.plan?.originalPrice ?? 0;
  return Number(p) || 0;
};

// Return the best image URL for an item (item.image, dish.image, plan.image, fallback)
const getItemImage = (item: any) => {
  if (!item) return '/pic.png';
  // For plan purchases, use the local compact plan image to avoid external URLs
  if (item.plan) return '/pic.png';
  const fromItem = typeof item.image === 'string' && item.image.trim() ? item.image.trim() : '';
  const fromDish = typeof item.dish?.image === 'string' && item.dish.image.trim() ? item.dish.image.trim() : '';
  return fromItem || fromDish || '/pic.png';
};

const computeOrderTotal = (order: Order) => {
  return order.items.reduce((s, it) => s + getItemPrice(it as any) * ((it as any).qty || 0), 0);
};

const OrderCard: React.FC<{ order: Order; onOpen?: (order: Order) => void }> = ({ order, onOpen }) => {
  const openOrder = () => {
    if (onOpen) onOpen(order);
  };

  return (
    <button type="button" onClick={openOrder} className="w-full text-left">
      <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-start hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-olive-300 overflow-hidden">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
          <SmartImage src={getItemImage(order.items[0])} alt={order.items[0]?.name || 'Meal'} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{getDisplayName(order.items[0])}</h3>
                <p className="text-xs text-gray-500 truncate">Order #{order.id} • <b>{formatDateDMY(order.createdAt)}</b></p>
              </div>
            <div className="ml-2 flex-shrink-0 w-28 text-right">
              <div className="text-sm font-medium">₹{(Number(order.total) || computeOrderTotal(order)).toFixed(2)}</div>
              <div className="text-xs text-olive-600">{order.status}</div>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-700">
            {order.items.slice(0,3).map((it, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="truncate min-w-0">{(it as any).qty} x {(it as any).name ?? (it as any).dish?.name}</div>
                <div className="text-gray-500">₹{(getItemPrice(it as any) * ((it as any).qty || 0)).toFixed(2)}</div>
              </div>
            ))}
            {order.items.length > 3 && <div className="text-xs text-gray-400">+{order.items.length - 3} more items</div>}
          </div>
        </div>
      </div>
    </button>
  );
};

const OrderDetailsModal: React.FC<{ order: Order | null; onClose: () => void }> = ({ order, onClose }) => {
  if (!order) return null;

  const item = order.items[0] as any;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-full max-w-md shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <div className="p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-36 h-36 rounded-md overflow-hidden bg-gray-50">
              <SmartImage src={getItemImage(item)} alt={item?.name ?? item?.dish?.name ?? 'Item'} className="w-full h-full object-cover" />
            </div>
            <div className="text-lg font-semibold text-center">{item?.name ?? item?.dish?.name ?? getDisplayName(item)}</div>
            <div className="text-sm text-gray-600">Order #{order.id}</div>
            <div className="text-sm text-gray-500">Date: {formatDateOnly(order.createdAt)}</div>
            <div className="text-sm text-gray-800">Qty: {item?.qty}</div>
            <div className="text-sm text-gray-800">Price: ₹{((item?.price ?? item?.dish?.price) ?? 0).toFixed(2)}</div>
            <div className="text-lg font-semibold mt-2">Total ₹{order.total.toFixed(2)}</div>
          </div>

          <div className="mt-4 flex justify-center">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  const app = useApp();
  // keep original behavior: vertical list, show 5 items by default

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!app || !app.state.user) {
          setError('Please sign in to view your orders.');
          setOrders([]);
          setLoading(false);
          return;
        }

        const userId = app.state.user.id;
        const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else if (res.status === 404) {
          setOrders([]);
        } else {
          setError('Failed to load orders.');
        }
      } catch (e) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrack = (id: string) => {
    window.open(`/orders/${id}`, '_blank');
  };

  const openDetails = (order: Order) => handleTrack(order.id);

  if (loading) return <div className="py-8 text-center">Loading orders…</div>;
  if (!orders.length) return <div className="py-8 text-center text-gray-500">You have no past orders yet.</div>;

  // Present orders newest -> oldest
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const visible = showAll ? sortedOrders : sortedOrders.slice(0, pageSize);

  // Find most recent order that contains a plan (monthly plan) from newest first
  const mostRecentPlanOrder = sortedOrders.find(o => o.items?.some((it: any) => (it as any).plan));

  const computePlanDates = (order: Order | undefined) => {
    if (!order) return null;
  const itemWithPlan = order.items.find((it: any) => (it as any).plan);
    if (!itemWithPlan) return null;
  const plan = (itemWithPlan as any).plan as any;
    const start = new Date(order.createdAt);
    // try parse duration like '1 Month' -> add months; fallback to 30 days
    let expiry = new Date(start);
    if (plan?.duration) {
      const m = /([0-9]+)\s*Month/i.exec(plan.duration);
      if (m) {
        expiry.setMonth(expiry.getMonth() + parseInt(m[1], 10));
      } else {
        expiry.setDate(expiry.getDate() + 30);
      }
    } else {
      expiry.setDate(expiry.getDate() + 30);
    }

    const price = plan?.discountedPrice ?? (itemWithPlan as any).price ?? (itemWithPlan as any).dish?.price ?? 0;
  // Use default compact plan image for monthly plans per request
  const image = '/pic.png';
    return { start, expiry, title: plan?.title ?? getDisplayName(itemWithPlan), price, image };
  };

  const planInfo = computePlanDates(mostRecentPlanOrder);

  return (
    <div className="space-y-6">
      {planInfo && (
        <section>
          <h2 className="text-lg font-semibold mb-3">My Current Plan</h2>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <div className="w-28 h-28 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
              <SmartImage src={planInfo.image || '/pic.png'} alt={planInfo.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-md font-semibold">{planInfo.title}</div>
                  <div className="text-sm text-gray-700 mt-1">Price: ₹{Number(planInfo.price).toFixed(2)}</div>
                  <div className="text-sm text-gray-500 mt-2">Start: {formatDateOnly(planInfo.start.toISOString())}</div>
                  <div className="text-sm text-gray-500">Expiry: {formatDateOnly(planInfo.expiry.toISOString())}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-olive-600 font-medium">Active</div>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200" />
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">My Order History</h2>
        <div className="space-y-4">
          {visible.map((o) => (
            <OrderCard key={o.id} order={o} onOpen={(ord) => setSelectedOrder(ord)} />
          ))}
        </div>

        {orders.length > pageSize && (
          <div className="mt-4 text-center">
            <button
              className="text-sm text-olive-600 font-medium hover:underline"
              onClick={() => setShowAll((s) => !s)}
            >
              {showAll ? 'Show Less' : `View All (${orders.length})`}
            </button>
          </div>
        )}
      </section>
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default OrderHistory;
