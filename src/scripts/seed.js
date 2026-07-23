import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MenuItem } from '../models/MenuItem.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eatery';

const menuItems = [
  {
    name: 'Truffle Parmesan Fries',
    description: 'Crispy hand-cut fries tossed in white truffle oil, grated parmesan cheese, and fresh parsley. Served with garlic aioli.',
    price: 8.5,
    category: 'Appetizers',
    isDietary: ['vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Garlic Butter Crispy Calamari',
    description: 'Tender calamari rings lightly dusted and fried to golden perfection, tossed with garlic butter and cherry peppers.',
    price: 14.0,
    category: 'Appetizers',
    isDietary: [],
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Classic Wagyu Burger',
    description: 'Grilled Wagyu beef patty, melted aged cheddar, caramelized onions, butter lettuce, and house sauce on a toasted brioche bun.',
    price: 18.0,
    category: 'Mains',
    isDietary: [],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Avocado Grilled Salmon Bowl',
    description: 'Fresh grilled Atlantic salmon, warm jasmine rice, sliced avocado, edamame, shredded carrots, and toasted sesame ginger dressing.',
    price: 22.5,
    category: 'Mains',
    isDietary: ['gluten-free'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Truffle Wild Mushroom Risotto',
    description: 'Creamy Arborio rice simmered with wild porcini mushrooms, parmigiano-reggiano, and finished with a drizzle of white truffle oil.',
    price: 19.5,
    category: 'Mains',
    isDietary: ['vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Molten Chocolate Lava Cake',
    description: 'Rich chocolate cake with a warm, liquid dark chocolate center. Served with a scoop of vanilla bean ice cream.',
    price: 9.5,
    category: 'Desserts',
    isDietary: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Signature Cold Brew Coffee',
    description: '24-hour slow-steeped organic coffee beans served over ice with your choice of milk.',
    price: 4.5,
    category: 'Drinks',
    isDietary: ['vegan', 'vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Fresh Hibiscus Mint Lemonade',
    description: 'House-brewed sweet hibiscus flower infusion mixed with freshly squeezed lemons and muddled mint leaves.',
    price: 5.0,
    category: 'Drinks',
    isDietary: ['vegan', 'vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=60',
  },
];

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  console.log('Start seeding menu items...');
  await MenuItem.deleteMany({});
  console.log('Cleared existing menu items.');

  for (const item of menuItems) {
    const created = await MenuItem.create(item);
    console.log(`Created menu item: ${created.name} (${created._id})`);
  }
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  });
