'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check, Share2, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/ui/Button';
import Portal from '@/components/ui/Portal';
import { 
  getReferralStats, 
  shareReferralViaWhatsApp, 
  copyReferralMessage,
  initializeReferralData
} from '@/utils/referral';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [copiedReferral, setCopiedReferral] = React.useState(false);

  // Get referral statistics - initialize if doesn't exist
  const referralStats = React.useMemo(() => {
    if (!state.user) return null;
    
    let stats = getReferralStats(state.user.id);
    // If no referral data exists, initialize it
    if (stats.totalReferrals === 0 && stats.totalEarnings === 0) {
      initializeReferralData(state.user.id);
      stats = getReferralStats(state.user.id);
    }
    return stats;
  }, [state.user]);

  const handleCopyReferral = async () => {
    if (state.user && referralStats) {
      const success = await copyReferralMessage(referralStats.referralCode, state.user.fullName);
      if (success) {
        setCopiedReferral(true);
        setTimeout(() => setCopiedReferral(false), 2000);
      }
    }
  };

  const handleShareReferral = () => {
    if (state.user && referralStats) {
      shareReferralViaWhatsApp(referralStats.referralCode, state.user.fullName);
    }
  };

  if (!state.user) return null;

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-start justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-auto my-2 sm:my-8 flex flex-col"
            style={{ position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Refer & Earn</h2>
                  <p className="text-white/80 text-sm">Share and earn rewards!</p>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6" style={{ maxHeight: 'calc(95vh - 120px)' }}>
              {/* Referral Stats */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">Your Referral Stats</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Total Earnings</p>
                    <p className="font-bold text-purple-800">₹{referralStats?.totalEarnings || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600">
                      {referralStats?.totalReferrals || 0} referrals
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-purple-600 mb-4">
                  Share your code and earn ₹50-100 when friends order!
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white p-3 rounded-lg border border-purple-200">
                      <p className="font-mono font-bold text-purple-800 text-lg text-center">
                        {referralStats?.referralCode || 'Loading...'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyReferral}
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      {copiedReferral ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareReferral}
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share via WhatsApp
                  </Button>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Share your referral code with friends</li>
                  <li>2. They place their first order using your code</li>
                  <li>3. You earn ₹50-100 for each successful referral</li>
                  <li>4. Your friend gets a discount too!</li>
                </ol>
              </div>

              {/* Close Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default ReferralModal;
