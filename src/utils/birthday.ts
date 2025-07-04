// Birthday utility functions for Mealzee

export interface BirthdayInfo {
  isBirthdayToday: boolean;
  isBirthdayThisWeek: boolean;
  isBirthdayThisMonth: boolean;
  daysUntilBirthday: number;
  age: number;
}

/**
 * Calculate birthday information for a given date of birth
 */
export function calculateBirthdayInfo(dateOfBirth: string): BirthdayInfo {
  if (!dateOfBirth) {
    return {
      isBirthdayToday: false,
      isBirthdayThisWeek: false,
      isBirthdayThisMonth: false,
      daysUntilBirthday: 365,
      age: 0,
    };
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Calculate this year's birthday
  const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // If birthday has passed this year, calculate for next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Calculate days until birthday
  const timeDiff = thisYearBirthday.getTime() - today.getTime();
  const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Check if birthday is today
  const isBirthdayToday = daysUntilBirthday === 0;

  // Check if birthday is this week (within 7 days)
  const isBirthdayThisWeek = daysUntilBirthday <= 7;

  // Check if birthday is this month
  const isBirthdayThisMonth = thisYearBirthday.getMonth() === today.getMonth();

  return {
    isBirthdayToday,
    isBirthdayThisWeek,
    isBirthdayThisMonth,
    daysUntilBirthday,
    age: isBirthdayToday ? age + 1 : age,
  };
}

/**
 * Get birthday message based on birthday info
 */
export function getBirthdayMessage(birthdayInfo: BirthdayInfo, userName: string): string {
  if (birthdayInfo.isBirthdayToday) {
    return `🎉 Happy Birthday, ${userName}! You're turning ${birthdayInfo.age} today!`;
  }
  
  if (birthdayInfo.isBirthdayThisWeek) {
    const days = birthdayInfo.daysUntilBirthday;
    return `🎂 Your birthday is in ${days} day${days === 1 ? '' : 's'}! Get ready to celebrate!`;
  }
  
  if (birthdayInfo.isBirthdayThisMonth) {
    const days = birthdayInfo.daysUntilBirthday;
    return `🎈 Your birthday is coming up in ${days} days this month!`;
  }
  
  return '';
}

/**
 * Get birthday special offers based on birthday info
 */
export function getBirthdayOffers(birthdayInfo: BirthdayInfo): Array<{
  title: string;
  description: string;
  discount: number;
  validUntil: string;
}> {
  const offers = [];
  
  if (birthdayInfo.isBirthdayToday) {
    offers.push({
      title: "🎉 Birthday Special!",
      description: "Get 50% off on any meal plan today!",
      discount: 50,
      validUntil: "Today only",
    });
    
    offers.push({
      title: "🎂 Free Birthday Dessert",
      description: "Complimentary dessert with any order today!",
      discount: 100,
      validUntil: "Today only",
    });
  }
  
  if (birthdayInfo.isBirthdayThisWeek && !birthdayInfo.isBirthdayToday) {
    offers.push({
      title: "🎈 Birthday Week Special",
      description: "25% off on all meal plans this week!",
      discount: 25,
      validUntil: "This week",
    });
  }
  
  if (birthdayInfo.isBirthdayThisMonth && !birthdayInfo.isBirthdayThisWeek) {
    offers.push({
      title: "🎊 Birthday Month Offer",
      description: "15% off on combo meals this month!",
      discount: 15,
      validUntil: "This month",
    });
  }
  
  return offers;
}

/**
 * Format birthday date for display
 */
export function formatBirthdayDate(dateOfBirth: string): string {
  if (!dateOfBirth) return '';
  
  const date = new Date(dateOfBirth);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Check if user should see birthday notification
 */
export function shouldShowBirthdayNotification(birthdayInfo: BirthdayInfo): boolean {
  return birthdayInfo.isBirthdayToday || 
         birthdayInfo.isBirthdayThisWeek || 
         birthdayInfo.isBirthdayThisMonth;
}
