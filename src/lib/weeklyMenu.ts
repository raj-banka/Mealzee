// Weekly Menu Data for Mealzee - Updated with exact menu and pricing

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  time: string;
  rating: number;
  isVeg: boolean;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  image?: string;
  ingredients?: string[];
  calories?: number;
  spiceLevel?: 'mild' | 'medium' | 'spicy';
}

export interface DayMenu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface WeeklyMenuData {
  [key: string]: DayMenu;
}

export const WEEKLY_MENU: WeeklyMenuData = {
  Monday: {
    breakfast: [
      {
        id: 1,
        name: 'Aloo Paratha & Tomato Ketchup',
        price: 40,
        time: '15 min',
        rating: 4.5,
        isVeg: true,
        type: 'breakfast',
        description: 'Fresh homemade potato stuffed paratha with tangy tomato ketchup',
        spiceLevel: 'mild',
        calories: 350,
        image: '/images/aalu paratha.jpg'
      }
    ],
    lunch: [
      {
        id: 2,
        name: 'Roti, Chawal, Dal, Sabji, Achar, Chutney',
        price: 70,
        time: '20 min',
        rating: 4.6,
        isVeg: true,
        type: 'lunch',
        description: 'Complete traditional meal with roti, rice, dal, vegetable curry, pickle and chutney',
        spiceLevel: 'medium',
        calories: 450,
        image: '/images/vegthali.jpg'
      }
    ],
    dinner: [
      {
        id: 3,
        name: 'Roti, Sabji, Sweet',
        price: 60,
        time: '18 min',
        rating: 4.4,
        isVeg: true,
        type: 'dinner',
        description: 'Fresh roti with seasonal vegetable curry and traditional sweet',
        spiceLevel: 'mild',
        calories: 380,
        image: '/images/roti-mitha.jpg'
      }
    ]
  },
  Tuesday: {
    breakfast: [
      {
        id: 4,
        name: 'Bread Toast & Jam/Ketchup',
        price: 35,
        time: '10 min',
        rating: 4.2,
        isVeg: true,
        type: 'breakfast',
        description: 'Crispy bread toast served with jam or ketchup',
        spiceLevel: 'mild',
        calories: 250,
        image: '/images/sandwich.jpg'
      }
    ],
    lunch: [
      {
        id: 5,
        name: 'Pulao, Tadka, Papad',
        price: 60,
        time: '22 min',
        rating: 4.5,
        isVeg: true,
        type: 'lunch',
        description: 'Aromatic pulao rice with spiced tadka and crispy papad',
        spiceLevel: 'medium',
        calories: 400,
        image: '/images/pulao-papad.jpg'
      }
    ],
    dinner: [
      {
        id: 6,
        name: 'Paratha, Mix Veg',
        price: 55,
        time: '18 min',
        rating: 4.3,
        isVeg: true,
        type: 'dinner',
        description: 'Soft paratha with mixed vegetable curry',
        spiceLevel: 'medium',
        calories: 360,
        image: '/images/paratha.jpg'
      }
    ]
  },
  Wednesday: {
    breakfast: [
      {
        id: 7,
        name: 'Idli & Chutney',
        price: 35,
        time: '12 min',
        rating: 4.4,
        isVeg: true,
        type: 'breakfast',
        description: 'Steamed rice cakes with coconut chutney',
        spiceLevel: 'mild',
        calories: 280,
        image: '/images/vegthali.jpg'
      }
    ],
    lunch: [
      {
        id: 8,
        name: 'Roti, Jeera Rice, Egg Curry, Chips',
        price: 85,
        time: '25 min',
        rating: 4.7,
        isVeg: false,
        type: 'lunch',
        description: 'Roti with cumin rice, spicy egg curry and crispy chips',
        spiceLevel: 'spicy',
        calories: 520,
        image: '/images/egg-chawal.jpg'
      },
      {
        id: 9,
        name: 'Roti, Jeera Rice, Pakoda, Kadhi',
        price: 70,
        time: '22 min',
        rating: 4.5,
        isVeg: true,
        type: 'lunch',
        description: 'Roti with cumin rice, pakoda and traditional kadhi',
        spiceLevel: 'medium',
        calories: 450,
        image: '/images/kadhi-chawal.jpg'
      }
    ],
    dinner: [
      {
        id: 10,
        name: 'Roti, Chicken Chili',
        price: 95,
        time: '28 min',
        rating: 4.8,
        isVeg: false,
        type: 'dinner',
        description: 'Fresh roti with spicy chicken chili',
        spiceLevel: 'spicy',
        calories: 480,
        image: '/images/roti-manchuriyan.jpg'
      },
      {
        id: 11,
        name: 'Roti, Soya Chili',
        price: 70,
        time: '20 min',
        rating: 4.4,
        isVeg: true,
        type: 'dinner',
        description: 'Fresh roti with spicy soya chili',
        spiceLevel: 'spicy',
        calories: 400,
        image: '/images/roti-manchuriyan.jpg'
      }
    ]
  },
  Thursday: {
    breakfast: [
      {
        id: 12,
        name: 'Chowmein / Pasta',
        price: 45,
        time: '18 min',
        rating: 4.6,
        isVeg: true,
        type: 'breakfast',
        description: 'Delicious chowmein noodles or pasta with vegetables',
        spiceLevel: 'medium',
        calories: 320,
        image: '/images/chawmin.jpg'
      }
    ],
    lunch: [
      {
        id: 13,
        name: 'Roti, Rajma, Chawal, Sabji, Achar, Chips',
        price: 75,
        time: '25 min',
        rating: 4.7,
        isVeg: true,
        type: 'lunch',
        description: 'Complete meal with roti, rajma curry, rice, vegetable, pickle and chips',
        spiceLevel: 'medium',
        calories: 480,
        image: '/images/vegthali.jpg'
      }
    ],
    dinner: [
      {
        id: 14,
        name: 'Sattu Paratha & Ketchup / Sabji',
        price: 65,
        time: '20 min',
        rating: 4.5,
        isVeg: true,
        type: 'dinner',
        description: 'Nutritious sattu paratha with ketchup or vegetable curry',
        spiceLevel: 'mild',
        calories: 380,
        image: '/images/ajwainparatha.jpg'
      }
    ]
  },
  Friday: {
    breakfast: [
      {
        id: 15,
        name: 'Puri & Sabji',
        price: 45,
        time: '15 min',
        rating: 4.5,
        isVeg: true,
        type: 'breakfast',
        description: 'Crispy puri with flavorful vegetable curry',
        spiceLevel: 'medium',
        calories: 340,
        image: '/images/puri chola.jpg'
      }
    ],
    lunch: [
      {
        id: 16,
        name: 'Roti, Chawal, Fish Curry',
        price: 95,
        time: '30 min',
        rating: 4.8,
        isVeg: false,
        type: 'lunch',
        description: 'Fresh roti with rice and traditional fish curry',
        spiceLevel: 'spicy',
        calories: 520,
        image: '/images/machli chawal.jpg'
      },
      {
        id: 17,
        name: 'Roti, Chawal, Aloo Dum',
        price: 70,
        time: '22 min',
        rating: 4.6,
        isVeg: true,
        type: 'lunch',
        description: 'Roti with rice and spicy potato curry',
        spiceLevel: 'medium',
        calories: 450,
        image: '/images/vegthali.jpg'
      }
    ],
    dinner: [
      {
        id: 18,
        name: 'Paratha & Paneer',
        price: 75,
        time: '25 min',
        rating: 4.7,
        isVeg: true,
        type: 'dinner',
        description: 'Soft paratha with creamy paneer curry',
        spiceLevel: 'medium',
        calories: 420,
        image: '/images/nan-paner.jpg'
      },
      {
        id: 19,
        name: 'Paratha & Sabji',
        price: 60,
        time: '18 min',
        rating: 4.4,
        isVeg: true,
        type: 'dinner',
        description: 'Fresh paratha with seasonal vegetable curry',
        spiceLevel: 'medium',
        calories: 380,
        image: '/images/paratha.jpg'
      }
    ]
  },
  Saturday: {
    breakfast: [
      {
        id: 20,
        name: 'Sandwich & Ketchup',
        price: 40,
        time: '12 min',
        rating: 4.3,
        isVeg: true,
        type: 'breakfast',
        description: 'Fresh sandwich with tomato ketchup',
        spiceLevel: 'mild',
        calories: 280,
        image: '/images/sandwich.jpg'
      }
    ],
    lunch: [
      {
        id: 21,
        name: 'Khichdi, Chokha, Achar, Chips',
        price: 65,
        time: '20 min',
        rating: 4.5,
        isVeg: true,
        type: 'lunch',
        description: 'Comfort khichdi with chokha, pickle and crispy chips',
        spiceLevel: 'mild',
        calories: 400,
        image: '/images/khicdi.jpg'
      }
    ],
    dinner: [
      {
        id: 22,
        name: 'Roti & Sabji',
        price: 55,
        time: '15 min',
        rating: 4.4,
        isVeg: true,
        type: 'dinner',
        description: 'Fresh roti with seasonal vegetable curry',
        spiceLevel: 'medium',
        calories: 350,
        image: '/images/roti-mitha.jpg'
      },
      {
        id: 23,
        name: 'Roti & Bhindi',
        price: 60,
        time: '18 min',
        rating: 4.5,
        isVeg: true,
        type: 'dinner',
        description: 'Fresh roti with delicious bhindi (okra) curry',
        spiceLevel: 'medium',
        calories: 360,
        image: '/images/roti=bhujiya.jpg'
      }
    ]
  },
  Sunday: {
    breakfast: [
      {
        id: 24,
        name: 'Roti & Mix Veg',
        price: 45,
        time: '18 min',
        rating: 4.6,
        isVeg: true,
        type: 'breakfast',
        description: 'Fresh roti with mixed vegetable curry',
        spiceLevel: 'medium',
        calories: 320,
        image: '/images/vegthali.jpg'
      }
    ],
    lunch: [
      {
        id: 25,
        name: 'Chicken Biryani, Raita & Papad',
        price: 110,
        time: '35 min',
        rating: 4.9,
        isVeg: false,
        type: 'lunch',
        description: 'Aromatic chicken biryani served with cooling raita and crispy papad',
        spiceLevel: 'spicy',
        calories: 580,
        image: '/images/biryani.jpg'
      },
      {
        id: 26,
        name: 'Veg Biryani, Raita & Papad',
        price: 85,
        time: '30 min',
        rating: 4.7,
        isVeg: true,
        type: 'lunch',
        description: 'Fragrant vegetable biryani with raita and papad',
        spiceLevel: 'medium',
        calories: 480,
        image: '/images/veg biryani.jpg'
      }
    ],
    dinner: [
      {
        id: 27,
        name: 'Chole Bhature',
        price: 70,
        time: '25 min',
        rating: 4.8,
        isVeg: true,
        type: 'dinner',
        description: 'Spicy chickpea curry with fluffy bhature',
        spiceLevel: 'spicy',
        calories: 450,
        image: '/images/puri chola.jpg'
      }
    ]
  }
};

// Helper functions
export function getMenuForDay(day: string): DayMenu | null {
  return WEEKLY_MENU[day] || null;
}

export function getMenuItemById(id: number): MenuItem | null {
  for (const day of Object.values(WEEKLY_MENU)) {
    for (const mealType of Object.values(day)) {
      const item = mealType.find((item: MenuItem) => item.id === id);
      if (item) return item;
    }
  }
  return null;
}

export function getMenuByMealType(mealType: 'breakfast' | 'lunch' | 'dinner'): MenuItem[] {
  const items: MenuItem[] = [];
  for (const day of Object.values(WEEKLY_MENU)) {
    if (day[mealType]) {
      items.push(...day[mealType]);
    }
  }
  return items;
}

export function getVegetarianItems(): MenuItem[] {
  const items: MenuItem[] = [];
  for (const day of Object.values(WEEKLY_MENU)) {
    for (const mealType of Object.values(day)) {
      items.push(...mealType.filter((item: MenuItem) => item.isVeg));
    }
  }
  return items;
}

export function getNonVegetarianItems(): MenuItem[] {
  const items: MenuItem[] = [];
  for (const day of Object.values(WEEKLY_MENU)) {
    for (const mealType of Object.values(day)) {
      items.push(...mealType.filter((item: MenuItem) => !item.isVeg));
    }
  }
  return items;
}

export function getAllMenuItems(): MenuItem[] {
  const items: MenuItem[] = [];
  for (const day of Object.values(WEEKLY_MENU)) {
    for (const mealType of Object.values(day)) {
      items.push(...mealType);
    }
  }
  return items;
}

export function getMenuItemsByPrice(minPrice: number, maxPrice: number): MenuItem[] {
  const allItems = getAllMenuItems();
  return allItems.filter(item => item.price >= minPrice && item.price <= maxPrice);
}

export function getMenuItemsBySpiceLevel(spiceLevel: 'mild' | 'medium' | 'spicy'): MenuItem[] {
  const allItems = getAllMenuItems();
  return allItems.filter(item => item.spiceLevel === spiceLevel);
}
