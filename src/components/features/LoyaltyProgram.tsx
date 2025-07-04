'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Gift, 
  Trophy, 
  Crown, 
  Zap,
  Users,
  Calendar,
  Award
} from 'lucide-react';

interface LoyaltyTier {
  name: string;
  icon: React.ReactNode;
  minPoints: number;
  benefits: string[];
  color: string;
  bgColor: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'freebie' | 'upgrade';
  icon: React.ReactNode;
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    icon: <Award className="w-6 h-6" />,
    minPoints: 0,
    benefits: ['5% cashback on orders', 'Birthday surprise meal', 'Priority customer support'],
    color: 'text-olive-600',
    bgColor: 'bg-olive-100'
  },
  {
    name: 'Silver',
    icon: <Star className="w-6 h-6" />,
    minPoints: 1000,
    benefits: ['10% cashback on orders', 'Free delivery', 'Monthly bonus meal', 'Early access to new menus'],
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    name: 'Gold',
    icon: <Trophy className="w-6 h-6" />,
    minPoints: 2500,
    benefits: ['15% cashback on orders', 'Free premium upgrades', 'Weekly bonus meals', 'Exclusive chef specials'],
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    name: 'Platinum',
    icon: <Crown className="w-6 h-6" />,
    minPoints: 5000,
    benefits: ['20% cashback on orders', 'Unlimited free delivery', 'Daily bonus items', 'Personal meal consultant'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

const rewards: Reward[] = [
  {
    id: '1',
    title: '₹100 Off Next Order',
    description: 'Get ₹100 discount on your next meal plan order',
    pointsCost: 500,
    category: 'discount',
    icon: <Gift className="w-5 h-5" />
  },
  {
    id: '2',
    title: 'Free Dessert',
    description: 'Complimentary dessert with your next meal',
    pointsCost: 200,
    category: 'freebie',
    icon: <Star className="w-5 h-5" />
  },
  {
    id: '3',
    title: 'Premium Meal Upgrade',
    description: 'Upgrade any meal to premium version for free',
    pointsCost: 300,
    category: 'upgrade',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: '4',
    title: '₹250 Off Next Order',
    description: 'Get ₹250 discount on orders above ₹1000',
    pointsCost: 1000,
    category: 'discount',
    icon: <Gift className="w-5 h-5" />
  }
];

const LoyaltyProgram: React.FC = () => {
  const [userPoints] = useState(1250);
  const [currentTier, setCurrentTier] = useState(1); // Silver tier
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  const getCurrentTier = () => {
    for (let i = loyaltyTiers.length - 1; i >= 0; i--) {
      if (userPoints >= loyaltyTiers[i].minPoints) {
        return loyaltyTiers[i];
      }
    }
    return loyaltyTiers[0];
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    const currentIndex = loyaltyTiers.findIndex(tier => tier.name === current.name);
    return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    
    const current = getCurrentTier();
    const progress = ((userPoints - current.minPoints) / (nextTier.minPoints - current.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  const handleRedeemReward = (rewardId: string, pointsCost: number) => {
    if (userPoints >= pointsCost && !redeemedRewards.includes(rewardId)) {
      setRedeemedRewards(prev => [...prev, rewardId]);
      // In a real app, you would deduct points from user's account
      alert('Reward redeemed successfully! Check your account for details.');
    }
  };

  const currentTierData = getCurrentTier();
  const nextTierData = getNextTier();
  const progressPercentage = getProgressToNextTier();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mealzee Rewards</h1>
        <p className="text-gray-600">Earn points with every order and unlock amazing rewards</p>
      </div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Your Points Balance</h2>
            <div className="text-3xl font-bold">{userPoints.toLocaleString()} Points</div>
          </div>
          <div className={`p-3 rounded-full ${currentTierData.bgColor}`}>
            <div className={currentTierData.color}>
              {currentTierData.icon}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{currentTierData.name} Member</span>
            {nextTierData && (
              <span className="text-sm opacity-90">
                {nextTierData.minPoints - userPoints} points to {nextTierData.name}
              </span>
            )}
          </div>
          
          {nextTierData && (
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-white rounded-full h-2"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Loyalty Tiers */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Loyalty Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loyaltyTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                tier.name === currentTierData.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${tier.bgColor} ${tier.color} w-fit mb-3`}>
                {tier.icon}
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{tier.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{tier.minPoints}+ points</p>
              <ul className="space-y-1">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                    <span className="text-green-500 mr-1">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Available Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    {reward.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{reward.title}</h4>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-green-600">
                  {reward.pointsCost} points
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRedeemReward(reward.id, reward.pointsCost)}
                  disabled={userPoints < reward.pointsCost || redeemedRewards.includes(reward.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    userPoints >= reward.pointsCost && !redeemedRewards.includes(reward.id)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {redeemedRewards.includes(reward.id) ? 'Redeemed' : 'Redeem'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to Earn Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">How to Earn Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Place Orders</div>
              <div className="text-sm text-gray-600">Earn 1 point per ₹10 spent</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Refer Friends</div>
              <div className="text-sm text-gray-600">Get 500 points per referral</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-olive-100 text-olive-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Write Reviews</div>
              <div className="text-sm text-gray-600">Earn 50 points per review</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoyaltyProgram;
