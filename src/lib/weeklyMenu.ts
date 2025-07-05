// Weekly Menu Data for Mealzee

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  time: string;
  rating: number;
  isVeg: boolean;
  description: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'combo';
  image?: string;
  ingredients?: string[];
  calories?: number;
  spiceLevel?: 'mild' | 'medium' | 'spicy';
}

export interface DayMenu {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
  combo: MenuItem[];
}

export interface WeeklyMenuData {
  [key: string]: DayMenu;
}

export const WEEKLY_MENU: WeeklyMenuData = {
  Monday: {
    breakfast: [
      {
        id: 1,
        name: 'Masala Dosa',
        price: 80,
        time: '15 min',
        rating: 4.5,
        isVeg: true,
        type: 'breakfast',
        description: 'Crispy dosa with spicy potato filling and coconut chutney',
        spiceLevel: 'medium',
        calories: 350
      },
      {
        id: 2,
        name: 'Poha',
        price: 60,
        time: '10 min',
        rating: 4.3,
        isVeg: true,
        type: 'breakfast',
        description: 'Flattened rice with vegetables, peanuts and spices',
        spiceLevel: 'mild',
        calories: 250
      },
      {
        id: 3,
        name: 'Upma',
        price: 50,
        time: '12 min',
        rating: 4.2,
        isVeg: true,
        type: 'breakfast',
        description: 'Semolina porridge with vegetables and curry leaves',
        spiceLevel: 'mild',
        calories: 200
      }
    ],
    lunch: [
      {
        id: 4,
        name: 'Dal Rice Combo',
        price: 120,
        time: '20 min',
        rating: 4.4,
        isVeg: true,
        type: 'lunch',
        description: 'Yellow dal with steamed rice, pickle and papad',
        spiceLevel: 'mild',
        calories: 450
      },
      {
        id: 5,
        name: 'Chicken Curry Rice',
        price: 180,
        time: '25 min',
        rating: 4.6,
        isVeg: false,
        type: 'lunch',
        description: 'Spicy chicken curry with basmati rice and salad',
        spiceLevel: 'spicy',
        calories: 550
      },
      {
        id: 6,
        name: 'Rajma Rice',
        price: 140,
        time: '22 min',
        rating: 4.5,
        isVeg: true,
        type: 'lunch',
        description: 'Kidney beans curry with rice and onion salad',
        spiceLevel: 'medium',
        calories: 400
      }
    ],
    dinner: [
      {
        id: 7,
        name: 'Paneer Butter Masala',
        price: 160,
        time: '20 min',
        rating: 4.7,
        isVeg: true,
        type: 'dinner',
        description: 'Rich paneer curry with butter naan and rice',
        spiceLevel: 'medium',
        calories: 500
      },
      {
        id: 8,
        name: 'Fish Curry',
        price: 200,
        time: '30 min',
        rating: 4.5,
        isVeg: false,
        type: 'dinner',
        description: 'Bengali style fish curry with steamed rice',
        spiceLevel: 'spicy',
        calories: 450
      },
      {
        id: 9,
        name: 'Aloo Gobi',
        price: 130,
        time: '18 min',
        rating: 4.3,
        isVeg: true,
        type: 'dinner',
        description: 'Potato and cauliflower curry with roti',
        spiceLevel: 'mild',
        calories: 350
      }
    ],
    combo: [
      {
        id: 10,
        name: 'Monday Special Thali',
        price: 220,
        time: '25 min',
        rating: 4.8,
        isVeg: true,
        type: 'combo',
        description: 'Complete meal with dal, sabzi, rice, roti, pickle and dessert',
        spiceLevel: 'medium',
        calories: 650
      }
    ]
  },
  Tuesday: {
    breakfast: [
      {
        id: 11,
        name: 'Idli Sambar',
        price: 70,
        time: '12 min',
        rating: 4.6,
        isVeg: true,
        type: 'breakfast',
        description: 'Steamed rice cakes with lentil curry and coconut chutney',
        spiceLevel: 'mild',
        calories: 300
      },
      {
        id: 12,
        name: 'Aloo Paratha',
        price: 90,
        time: '18 min',
        rating: 4.4,
        isVeg: true,
        type: 'breakfast',
        description: 'Stuffed potato flatbread with curd and pickle',
        spiceLevel: 'medium',
        calories: 400
      },
      {
        id: 13,
        name: 'Bread Omelette',
        price: 80,
        time: '10 min',
        rating: 4.2,
        isVeg: false,
        type: 'breakfast',
        description: 'Fluffy omelette with bread slices and ketchup',
        spiceLevel: 'mild',
        calories: 350
      }
    ],
    lunch: [
      {
        id: 14,
        name: 'Chole Rice',
        price: 150,
        time: '22 min',
        rating: 4.5,
        isVeg: true,
        type: 'lunch',
        description: 'Spicy chickpea curry with rice and onion salad',
        spiceLevel: 'spicy',
        calories: 480
      },
      {
        id: 15,
        name: 'Mutton Curry',
        price: 220,
        time: '35 min',
        rating: 4.7,
        isVeg: false,
        type: 'lunch',
        description: 'Tender mutton curry with basmati rice and raita',
        spiceLevel: 'spicy',
        calories: 600
      },
      {
        id: 16,
        name: 'Palak Paneer',
        price: 160,
        time: '20 min',
        rating: 4.6,
        isVeg: true,
        type: 'lunch',
        description: 'Spinach curry with cottage cheese and rice',
        spiceLevel: 'medium',
        calories: 420
      }
    ],
    dinner: [
      {
        id: 17,
        name: 'Butter Chicken',
        price: 200,
        time: '25 min',
        rating: 4.8,
        isVeg: false,
        type: 'dinner',
        description: 'Creamy chicken curry with butter naan and rice',
        spiceLevel: 'medium',
        calories: 550
      },
      {
        id: 18,
        name: 'Dal Makhani',
        price: 140,
        time: '22 min',
        rating: 4.5,
        isVeg: true,
        type: 'dinner',
        description: 'Rich black lentil curry with rice and naan',
        spiceLevel: 'mild',
        calories: 450
      },
      {
        id: 19,
        name: 'Egg Curry',
        price: 120,
        time: '18 min',
        rating: 4.3,
        isVeg: false,
        type: 'dinner',
        description: 'Spiced egg curry with rice and pickle',
        spiceLevel: 'medium',
        calories: 400
      }
    ],
    combo: [
      {
        id: 20,
        name: 'Tuesday Feast',
        price: 250,
        time: '30 min',
        rating: 4.9,
        isVeg: false,
        type: 'combo',
        description: 'Non-veg thali with chicken, rice, dal, roti and sides',
        spiceLevel: 'medium',
        calories: 700
      }
    ]
  }
  // Additional days can be added here...
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

export function getMenuByMealType(mealType: 'breakfast' | 'lunch' | 'dinner' | 'combo'): MenuItem[] {
  const items: MenuItem[] = [];
  for (const day of Object.values(WEEKLY_MENU)) {
    items.push(...day[mealType]);
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
