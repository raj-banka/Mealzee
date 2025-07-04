// Referral System Utilities

export interface ReferralData {
  code: string;
  userId: string;
  referredUsers: string[];
  totalEarnings: number;
  createdAt: Date;
}

/**
 * Generate a unique referral code for a user
 */
export const generateReferralCode = (userId: string): string => {
  return `MEAL${userId.slice(-6).toUpperCase()}`;
};

/**
 * Validate referral code format
 */
export const isValidReferralCode = (code: string): boolean => {
  return /^MEAL[A-Z0-9]{6}$/.test(code);
};

/**
 * Get referral data from localStorage
 */
export const getReferralData = (userId: string): ReferralData | null => {
  try {
    const data = localStorage.getItem(`mealzee_referral_${userId}`);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt)
      };
    }
  } catch (error) {
    console.error('Error loading referral data:', error);
  }
  return null;
};

/**
 * Save referral data to localStorage
 */
export const saveReferralData = (userId: string, data: ReferralData): void => {
  try {
    localStorage.setItem(`mealzee_referral_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving referral data:', error);
  }
};

/**
 * Initialize referral data for a new user
 */
export const initializeReferralData = (userId: string): ReferralData => {
  const referralData: ReferralData = {
    code: generateReferralCode(userId),
    userId,
    referredUsers: [],
    totalEarnings: 0,
    createdAt: new Date()
  };
  
  saveReferralData(userId, referralData);
  return referralData;
};

/**
 * Add a referred user and calculate earnings
 */
export const addReferredUser = (referrerUserId: string, referredUserId: string, orderAmount: number): void => {
  const referralData = getReferralData(referrerUserId);
  if (referralData) {
    // Add 10% of order amount as referral earnings (max ₹100 per referral)
    const earnings = Math.min(orderAmount * 0.1, 100);
    
    referralData.referredUsers.push(referredUserId);
    referralData.totalEarnings += earnings;
    
    saveReferralData(referrerUserId, referralData);
  }
};

/**
 * Get referral statistics
 */
export const getReferralStats = (userId: string) => {
  const referralData = getReferralData(userId);
  if (!referralData) {
    return {
      totalReferrals: 0,
      totalEarnings: 0,
      referralCode: generateReferralCode(userId)
    };
  }
  
  return {
    totalReferrals: referralData.referredUsers.length,
    totalEarnings: referralData.totalEarnings,
    referralCode: referralData.code
  };
};

/**
 * Create shareable referral message
 */
export const createReferralMessage = (referralCode: string, userName: string): string => {
  return `🍽️ Hey! I'm loving Mealzee's delicious home-cooked meals! 

Use my referral code: *${referralCode}* when you place your first order and get special discounts! 

Fresh, healthy, and delivered right to your doorstep! 🚀

Order now: https://mealzee.in

- ${userName}`;
};

/**
 * Share referral code via WhatsApp
 */
export const shareReferralViaWhatsApp = (referralCode: string, userName: string): void => {
  const message = createReferralMessage(referralCode, userName);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

/**
 * Copy referral message to clipboard
 */
export const copyReferralMessage = async (referralCode: string, userName: string): Promise<boolean> => {
  try {
    const message = createReferralMessage(referralCode, userName);
    await navigator.clipboard.writeText(message);
    return true;
  } catch (error) {
    console.error('Failed to copy referral message:', error);
    return false;
  }
};
