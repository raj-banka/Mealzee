// Referral System Utilities

export interface ReferralData {
  code: string;
  userId: string;
  referredUsers: string[];
  totalEarnings: number;
  pendingEarnings: number; // Earnings waiting for friend's full payment
  createdAt: Date;
}

/**
 * Generate a unique referral code for a user
 */
export const generateReferralCode = (userId: string): string => {
  // Generate numeric 6-digit suffix to match backend pattern MEAL######
  const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `MEAL${num}`;
};

/**
 * Validate referral code format
 */
export const isValidReferralCode = (code: string): boolean => {
  return /^MEAL\d{6}$/.test(code);
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
    pendingEarnings: 0,
    createdAt: new Date()
  };

  saveReferralData(userId, referralData);
  return referralData;
};

/**
 * Add a referred user (₹499 pending until friend pays full month bill)
 */
export const addReferredUser = (referrerUserId: string, referredUserId: string): void => {
  const referralData = getReferralData(referrerUserId);
  if (referralData) {
    referralData.referredUsers.push(referredUserId);
    referralData.pendingEarnings += 499; // ₹499 per referral

    saveReferralData(referrerUserId, referralData);
  }
};

/**
 * Confirm referral earnings when friend pays full month bill
 */
export const confirmReferralEarnings = (referrerUserId: string, referredUserId: string): void => {
  const referralData = getReferralData(referrerUserId);
  if (referralData && referralData.referredUsers.includes(referredUserId)) {
    // Move ₹499 from pending to confirmed earnings
    referralData.pendingEarnings = Math.max(0, referralData.pendingEarnings - 499);
    referralData.totalEarnings += 499;

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
      pendingEarnings: 0,
      referralCode: generateReferralCode(userId)
    };
  }

  return {
    totalReferrals: referralData.referredUsers.length,
    totalEarnings: referralData.totalEarnings,
    pendingEarnings: referralData.pendingEarnings || 0,
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
