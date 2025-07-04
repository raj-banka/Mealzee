'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Pause, 
  Play, 
  Edit, 
  Trash2, 
  Clock,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';

interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  endDate: string;
  nextDelivery: string;
  price: number;
  deliveryAddress: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    planName: 'Breakfast, Lunch & Dinner',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    nextDelivery: '2024-01-25',
    price: 3399,
    deliveryAddress: 'Sector 4, B.S. City, Delhi - 110001'
  },
  {
    id: '2',
    planName: 'Lunch & Dinner',
    status: 'paused',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    nextDelivery: '2024-01-26',
    price: 2899,
    deliveryAddress: 'Sector 4, B.S. City, Delhi - 110001'
  }
];

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handlePauseResume = (id: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status: sub.status === 'active' ? 'paused' : 'active' }
        : sub
    ));
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      setSubscriptions(prev => prev.map(sub => 
        sub.id === id 
          ? { ...sub, status: 'cancelled' }
          : sub
      ));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Subscriptions</h1>
        <p className="text-gray-600">Manage your meal plan subscriptions</p>
      </div>

      <div className="space-y-6">
        {subscriptions.map((subscription, index) => (
          <motion.div
            key={subscription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {subscription.planName}
                  </h3>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                    {getStatusIcon(subscription.status)}
                    <span className="capitalize">{subscription.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{subscription.price}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">
                      {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Next Delivery</div>
                    <div className="font-medium">{formatDate(subscription.nextDelivery)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div className="font-medium text-sm">{subscription.deliveryAddress}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {subscription.status === 'active' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePauseResume(subscription.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </motion.button>
                )}

                {subscription.status === 'paused' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePauseResume(subscription.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Resume</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Modify</span>
                </motion.button>

                {subscription.status !== 'cancelled' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCancel(subscription.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                )}
              </div>
            </div>

            {subscription.status === 'cancelled' && (
              <div className="bg-red-50 border-t border-red-200 p-4">
                <p className="text-red-700 text-sm">
                  This subscription has been cancelled. You can still access meals until {formatDate(subscription.endDate)}.
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {subscriptions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Calendar className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Active Subscriptions
          </h3>
          <p className="text-gray-500 mb-6">
            You don't have any meal plan subscriptions yet.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            Browse Meal Plans
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionManager;
