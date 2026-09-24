import { Product, Category, Order, Address, User } from '../types';

export interface FarmerProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  farm_name: string;
  village: string;
  district: string;
  state: string;
  category: string;
  farming_type: string;
  verification_details: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  total_sales: number;
  orders_count: number;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  created_at: string;
  total_orders: number;
  total_spent: number;
}

const STORAGE_KEY = 'agromart_db_v2';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-veg', name: 'Vegetables', slug: 'vegetables', icon: 'eco' },
  { id: 'cat-fruits', name: 'Fruits', slug: 'fruits', icon: 'nutrition' },
  { id: 'cat-grains', name: 'Grains', slug: 'grains', icon: 'grain' },
  { id: 'cat-seeds', name: 'Seeds', slug: 'seeds', icon: 'spa' },
  { id: 'cat-dairy', name: 'Dairy Products', slug: 'dairy', icon: 'egg' },
  { id: 'cat-spices', name: 'Spices', slug: 'spices', icon: 'local_florist' },
  { id: 'cat-other', name: 'Other Agricultural Products', slug: 'organic-farming', icon: 'agriculture' },
];

const INITIAL_FARMERS: FarmerProfile[] = [
  {
    id: 'f-1',
    user_id: 'u-farmer-1',
    name: 'Rajesh Patel',
    email: 'farmer@agromart.com',
    phone: '+91 98251 34920',
    farm_name: 'Patel Organic Farms',
    village: 'Panchavati',
    district: 'Nashik',
    state: 'Maharashtra',
    category: 'Vegetables & Seeds',
    farming_type: '100% Certified Organic (NPOP)',
    verification_details: 'NPOP-ORG-2023-MH-0842',
    status: 'approved',
    rating: 4.9,
    total_sales: 148500,
    orders_count: 84,
    created_at: '2025-11-12T09:30:00Z',
  },
  {
    id: 'f-2',
    user_id: 'u-farmer-2',
    name: 'Abdul Rashid Mir',
    email: 'kashmir@agromart.com',
    phone: '+91 94190 28411',
    farm_name: 'Kashmir Valley Organics',
    village: 'Pampore',
    district: 'Pulwama',
    state: 'Jammu & Kashmir',
    category: 'Spices & Fruits',
    farming_type: 'Natural Traditional Mountain Farming',
    verification_details: 'GI-KASHMIR-SAFFRON-89',
    status: 'approved',
    rating: 5.0,
    total_sales: 295000,
    orders_count: 112,
    created_at: '2025-10-04T11:20:00Z',
  },
  {
    id: 'f-3',
    user_id: 'u-farmer-3',
    name: 'Gurpreet Singh',
    email: 'gurpreet@agromart.com',
    phone: '+91 98722 55109',
    farm_name: 'Punjab Bio Fields',
    village: 'Khanna',
    district: 'Ludhiana',
    state: 'Punjab',
    category: 'Grains & Oils',
    farming_type: 'Zero-Budget Natural Farming (ZBNF)',
    verification_details: 'PB-AGRI-ORG-4412',
    status: 'approved',
    rating: 4.8,
    total_sales: 182400,
    orders_count: 67,
    created_at: '2025-12-01T08:15:00Z',
  },
  {
    id: 'f-4',
    user_id: 'u-farmer-4',
    name: 'Devendra Joshi',
    email: 'gaushala@agromart.com',
    phone: '+91 94265 19230',
    farm_name: 'Gir Gaushala Naturals',
    village: 'Junagadh Rural',
    district: 'Junagadh',
    state: 'Gujarat',
    category: 'Dairy Products',
    farming_type: 'A2 Vedic Desi Cow Dairy',
    verification_details: 'GJ-GIR-A2-CERT-2024',
    status: 'approved',
    rating: 4.95,
    total_sales: 215600,
    orders_count: 98,
    created_at: '2026-01-10T14:40:00Z',
  },
  {
    id: 'f-5',
    user_id: 'u-farmer-5',
    name: 'Vikas Yadav',
    email: 'newfarmer@agromart.com',
    phone: '+91 99881 77234',
    farm_name: 'Yadav Organic Farm',
    village: 'Sohna',
    district: 'Gurugram',
    state: 'Haryana',
    category: 'Vegetables',
    farming_type: 'Chemical-Free Hydroponic & Natural',
    verification_details: 'HR-AGR-VERIF-PENDING-71',
    status: 'pending_approval',
    rating: 0,
    total_sales: 0,
    orders_count: 0,
    created_at: '2026-03-20T10:10:00Z',
  },
];

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'c-1',
    name: 'Priya Sharma',
    email: 'customer@agromart.com',
    phone: '+91 98112 34567',
    status: 'active',
    created_at: '2026-01-05T12:00:00Z',
    total_orders: 5,
    total_spent: 4250,
  },
  {
    id: 'c-2',
    name: 'Rahul Verma',
    email: 'rahul.verma@gmail.com',
    phone: '+91 98711 98234',
    status: 'active',
    created_at: '2026-02-14T15:20:00Z',
    total_orders: 3,
    total_spent: 2890,
  },
  {
    id: 'c-3',
    name: 'Ananya Sen',
    email: 'ananya.sen@outlook.com',
    phone: '+91 97123 45678',
    status: 'active',
    created_at: '2026-03-01T08:45:00Z',
    total_orders: 2,
    total_spent: 1950,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  // --- VEGETABLES ---
  {
    id: 'p-veg-1',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Farm Fresh Organic Tomatoes',
    slug: 'farm-fresh-organic-tomatoes',
    category_id: 'cat-veg',
    category_name: 'Vegetables',
    description: 'Vine-ripened, naturally sweet organic tomatoes harvested at peak flavor. Free from synthetic chemicals, pesticides, and artificial wax coatings.',
    benefits: ['Rich in Lycopene antioxidant', 'High Vitamin C & Potassium', 'Vine-ripened natural aroma'],
    nutrition: { calories: '18 kcal', protein: '0.9g', carbs: '3.9g', fats: '0.2g' },
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&q=80&w=800',
    ],
    price: 45,
    unit: 'kg',
    stock_qty: 120,
    is_organic: true,
    badges: ['Daily Fresh', 'Zero Chemical'],
    rating_avg: 4.8,
    rating_count: 42,
    status: 'active',
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'p-veg-2',
    farmer_id: 'f-3',
    farmer_name: 'Gurpreet Singh',
    farm_name: 'Punjab Bio Fields',
    title: 'Mountain Grown Organic Potatoes',
    slug: 'mountain-grown-organic-potatoes',
    category_id: 'cat-veg',
    category_name: 'Vegetables',
    description: 'Unpolished earthy potatoes grown in nutrient-dense virgin soil. Ideal for daily curries, roasting, and steaming.',
    benefits: ['Natural complex carbohydrates', 'No chemical cold-storage anti-sprouting agents', 'Earthy authentic taste'],
    nutrition: { calories: '77 kcal', protein: '2.0g', carbs: '17.5g', fats: '0.1g' },
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=800',
    ],
    price: 35,
    unit: 'kg',
    stock_qty: 250,
    is_organic: true,
    badges: ['Unpolished', 'Pesticide Free'],
    rating_avg: 4.7,
    rating_count: 36,
    status: 'active',
    created_at: '2026-03-02T11:00:00Z',
  },
  {
    id: 'p-veg-3',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Fresh Baby Spinach (Desi Palak)',
    slug: 'fresh-baby-spinach-desi-palak',
    category_id: 'cat-veg',
    category_name: 'Vegetables',
    description: 'Tender, crisp iron-rich spinach leaves harvested at daybreak and washed with clean mountain water.',
    benefits: ['Extremely high in bio-available iron', 'Loaded with Vitamin K and lutein', 'Tender tender leaves'],
    nutrition: { calories: '23 kcal', protein: '2.9g', carbs: '3.6g', fats: '0.4g' },
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    ],
    price: 30,
    unit: 'bunch',
    stock_qty: 45,
    is_organic: true,
    badges: ['Morning Harvest', '100% Organic'],
    rating_avg: 4.9,
    rating_count: 58,
    status: 'active',
    created_at: '2026-03-03T07:00:00Z',
  },
  {
    id: 'p-veg-4',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Crisp Sweet Red Carrots',
    slug: 'crisp-sweet-red-carrots',
    category_id: 'cat-veg',
    category_name: 'Vegetables',
    description: 'Juicy natural red carrots with unmatched crunch and natural sweetness. Grown without chemical boosters.',
    benefits: ['Natural Beta-Carotene for eyesight', 'High dietary fiber', 'Crisp and juicy sweet taste'],
    nutrition: { calories: '41 kcal', protein: '0.9g', carbs: '9.6g', fats: '0.2g' },
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    ],
    price: 40,
    unit: 'kg',
    stock_qty: 90,
    is_organic: true,
    badges: ['Sweet & Crisp'],
    rating_avg: 4.85,
    rating_count: 29,
    status: 'active',
    created_at: '2026-03-04T08:00:00Z',
  },
  {
    id: 'p-veg-5',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Nashik Organic Red Onions',
    slug: 'nashik-organic-red-onions',
    category_id: 'cat-veg',
    category_name: 'Vegetables',
    description: 'Pungent, firm Nashik red onions celebrated across India for authentic aroma and long shelf life.',
    benefits: ['High in quercetin bioflavonoids', 'Strong flavor & natural aroma', 'Grown in mineral-rich volcanic soil'],
    nutrition: { calories: '40 kcal', protein: '1.1g', carbs: '9.3g', fats: '0.1g' },
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',
    ],
    price: 32,
    unit: 'kg',
    stock_qty: 300,
    is_organic: true,
    badges: ['Nashik Origin'],
    rating_avg: 4.75,
    rating_count: 51,
    status: 'active',
    created_at: '2026-03-05T09:00:00Z',
  },
  {
    id: 'p-veg-6',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Farm Fresh Green Bell Peppers',
    slug: 'farm-fresh-green-bell-peppers',
    category_id: 'cat-veg',
    category_name: 'Vegetables',
    description: 'Crisp green capsicum bursting with freshness. Ideal for salads, stir fries, and traditional stuffed preparations.',
    benefits: ['Zero pesticide residue', 'Rich in Vitamin C', 'Crisp texture'],
    nutrition: { calories: '20 kcal', protein: '0.9g', carbs: '4.6g', fats: '0.2g' },
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800',
    ],
    price: 55,
    unit: 'kg',
    stock_qty: 60,
    is_organic: true,
    badges: ['Green House Grown'],
    rating_avg: 4.8,
    rating_count: 22,
    status: 'active',
    created_at: '2026-03-06T10:00:00Z',
  },

  // --- FRUITS ---
  {
    id: 'p-fruit-1',
    farmer_id: 'f-2',
    farmer_name: 'Abdul Rashid Mir',
    farm_name: 'Kashmir Valley Organics',
    title: 'Kashmiri Royal Delicious Red Apples',
    slug: 'kashmiri-royal-delicious-red-apples',
    category_id: 'cat-fruits',
    category_name: 'Fruits',
    description: 'Hand-picked from the high-altitude orchards of Shopian, Kashmir. Naturally wax-free, crispy sweet, and fragrant.',
    benefits: ['100% natural, wax-free skin', 'Grown at 6000+ ft altitude', 'Rich in soluble fiber & antioxidants'],
    nutrition: { calories: '52 kcal', protein: '0.3g', carbs: '14g', fats: '0.2g' },
    images: [
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=800',
    ],
    price: 180,
    unit: 'kg',
    stock_qty: 85,
    is_organic: true,
    badges: ['Kashmir Heritage', 'No Wax'],
    rating_avg: 4.95,
    rating_count: 88,
    status: 'active',
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'p-fruit-2',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Ratnagiri Alphonso Mangoes (Hapus)',
    slug: 'ratnagiri-alphonso-mangoes-hapus',
    category_id: 'cat-fruits',
    category_name: 'Fruits',
    description: 'The King of Mangoes. Tree-ripened in organic hay without any carbide gas or chemical ripening sprays.',
    benefits: ['Naturally hay-ripened', 'Intensely aromatic saffron-orange pulp', 'Rich in Vitamins A & C'],
    nutrition: { calories: '60 kcal', protein: '0.8g', carbs: '15g', fats: '0.4g' },
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
    ],
    price: 850,
    unit: 'dozen',
    stock_qty: 40,
    is_organic: true,
    badges: ['Naturally Ripened', 'GI Tagged'],
    rating_avg: 5.0,
    rating_count: 64,
    status: 'active',
    created_at: '2026-03-05T09:30:00Z',
  },
  {
    id: 'p-fruit-3',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Nagpur Organic Juicy Oranges',
    slug: 'nagpur-organic-juicy-oranges',
    category_id: 'cat-fruits',
    category_name: 'Fruits',
    description: 'Plump, tangy-sweet oranges straight from Vidarbha orchards. Bursting with fresh citrus juice and immune vitamins.',
    benefits: ['Direct orchard harvest', 'Rich immune-boosting Vitamin C', 'Easy peeling, super juicy'],
    nutrition: { calories: '47 kcal', protein: '0.9g', carbs: '11.8g', fats: '0.1g' },
    images: [
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800',
    ],
    price: 90,
    unit: 'kg',
    stock_qty: 110,
    is_organic: true,
    badges: ['Vitamin C Rich'],
    rating_avg: 4.7,
    rating_count: 31,
    status: 'active',
    created_at: '2026-03-07T12:00:00Z',
  },
  {
    id: 'p-fruit-4',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Mahabaleshwar Fresh Strawberries',
    slug: 'mahabaleshwar-fresh-strawberries',
    category_id: 'cat-fruits',
    category_name: 'Fruits',
    description: 'Ruby red, sweet and aromatic strawberries handpicked in the misty valleys of Mahabaleshwar.',
    benefits: ['Zero chemical preservative coating', 'High in polyphenols & anthocyanins', 'Picked same day as dispatch'],
    nutrition: { calories: '32 kcal', protein: '0.7g', carbs: '7.7g', fats: '0.3g' },
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
    ],
    price: 140,
    unit: '250g box',
    stock_qty: 35,
    is_organic: true,
    badges: ['Handpicked', 'Super Fresh'],
    rating_avg: 4.9,
    rating_count: 47,
    status: 'active',
    created_at: '2026-03-08T07:15:00Z',
  },

  // --- GRAINS ---
  {
    id: 'p-grain-1',
    farmer_id: 'f-3',
    farmer_name: 'Gurpreet Singh',
    farm_name: 'Punjab Bio Fields',
    title: 'Royal Himalayan Organic Basmati Rice',
    slug: 'royal-himalayan-organic-basmati-rice',
    category_id: 'cat-grains',
    category_name: 'Grains',
    description: 'Aged for 2 full years for extra-long slender grains and mesmerizing natural fragrance. Grown using pure Himalayan glacier stream irrigation.',
    benefits: ['2-Year Naturally Aged', 'Glacier fed virgin soil', 'Elongates to double its size when cooked'],
    nutrition: { calories: '130 kcal', protein: '2.7g', carbs: '28g', fats: '0.3g' },
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    ],
    price: 195,
    unit: 'kg',
    stock_qty: 180,
    is_organic: true,
    badges: ['2-Year Aged', 'Pesticide Free'],
    rating_avg: 4.92,
    rating_count: 73,
    status: 'active',
    created_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'p-grain-2',
    farmer_id: 'f-3',
    farmer_name: 'Gurpreet Singh',
    farm_name: 'Punjab Bio Fields',
    title: 'Stone-Ground Sharbati Whole Wheat Flour',
    slug: 'stone-ground-sharbati-whole-wheat-flour',
    category_id: 'cat-grains',
    category_name: 'Grains',
    description: 'Traditional chakki-milled whole wheat flour retaining the entire wheat germ and bran. Yields exceptionally soft and sweet rotis.',
    benefits: ['100% Whole Grain with intact germ', 'Cold chakki milled to preserve nutrients', 'Naturally sweet Sehore grain'],
    nutrition: { calories: '340 kcal', protein: '13.2g', carbs: '72g', fats: '2.5g' },
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    ],
    price: 275,
    unit: '5kg pack',
    stock_qty: 95,
    is_organic: true,
    badges: ['Chakki Fresh', 'Whole Bran'],
    rating_avg: 4.88,
    rating_count: 53,
    status: 'active',
    created_at: '2026-02-22T14:00:00Z',
  },
  {
    id: 'p-grain-3',
    farmer_id: 'f-3',
    farmer_name: 'Gurpreet Singh',
    farm_name: 'Punjab Bio Fields',
    title: 'Ancient Organic Pearl Millet (Desi Bajra)',
    slug: 'ancient-organic-pearl-millet-desi-bajra',
    category_id: 'cat-grains',
    category_name: 'Grains',
    description: 'Drought-resilient ancient millet rich in magnesium, iron, and fiber. Perfect for winter khichdi and traditional bhakri.',
    benefits: ['Gluten-free nutrient dense grain', 'High iron and mineral profile', 'Zero chemical fertilizer intake'],
    nutrition: { calories: '378 kcal', protein: '11g', carbs: '73g', fats: '4.2g' },
    images: [
      'https://images.unsplash.com/photo-1627735489069-425b066060c5?auto=format&fit=crop&q=80&w=800',
    ],
    price: 65,
    unit: 'kg',
    stock_qty: 120,
    is_organic: true,
    badges: ['Superfood', 'High Iron'],
    rating_avg: 4.7,
    rating_count: 19,
    status: 'active',
    created_at: '2026-02-24T09:00:00Z',
  },

  // --- SEEDS ---
  {
    id: 'p-seed-1',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Certified Raw Organic Chia Seeds',
    slug: 'certified-raw-organic-chia-seeds',
    category_id: 'cat-seeds',
    category_name: 'Seeds',
    description: 'Raw, unpasteurized nutrient-dense chia seeds packed with heart-healthy Omega-3 fatty acids and soluble dietary fiber.',
    benefits: ['Massive Omega-3 ALA content', 'Superior hydration & digestion aid', 'Zero additives or processing'],
    nutrition: { calories: '486 kcal', protein: '16.5g', carbs: '42.1g', fats: '30.7g' },
    images: [
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=800',
    ],
    price: 185,
    unit: '250g pack',
    stock_qty: 70,
    is_organic: true,
    badges: ['Omega-3 Boost', 'Raw & Pure'],
    rating_avg: 4.9,
    rating_count: 45,
    status: 'active',
    created_at: '2026-03-01T15:00:00Z',
  },
  {
    id: 'p-seed-2',
    farmer_id: 'f-3',
    farmer_name: 'Gurpreet Singh',
    farm_name: 'Punjab Bio Fields',
    title: 'Cold-Cleaned Brown Flax Seeds (Alsi)',
    slug: 'cold-cleaned-brown-flax-seeds-alsi',
    category_id: 'cat-seeds',
    category_name: 'Seeds',
    description: 'Pure organic flax seeds rich in plant lignans and dietary fiber. Cleaned with air-sifters without harsh chemicals.',
    benefits: ['Rich in plant lignans and antioxidants', 'Promotes gut & heart wellness', 'Farm-grade purity'],
    nutrition: { calories: '534 kcal', protein: '18.3g', carbs: '28.9g', fats: '42.2g' },
    images: [
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=800',
    ],
    price: 95,
    unit: '500g pack',
    stock_qty: 150,
    is_organic: true,
    badges: ['High Fiber', 'Natural Lignans'],
    rating_avg: 4.8,
    rating_count: 38,
    status: 'active',
    created_at: '2026-03-02T16:00:00Z',
  },
  {
    id: 'p-seed-3',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Native Black Mustard Seeds (Rai)',
    slug: 'native-black-mustard-seeds-rai',
    category_id: 'cat-seeds',
    category_name: 'Seeds',
    description: 'Small, aromatic native black mustard seeds with high essential oil content. An indispensable foundation for Indian tadka.',
    benefits: ['High natural volatile oil content', 'Strong crackling aroma', 'Unadulterated native seed'],
    nutrition: { calories: '508 kcal', protein: '26g', carbs: '28g', fats: '36g' },
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    ],
    price: 55,
    unit: '200g pack',
    stock_qty: 200,
    is_organic: true,
    badges: ['High Essential Oil'],
    rating_avg: 4.85,
    rating_count: 27,
    status: 'active',
    created_at: '2026-03-04T12:00:00Z',
  },

  // --- DAIRY PRODUCTS ---
  {
    id: 'p-dairy-1',
    farmer_id: 'f-4',
    farmer_name: 'Devendra Joshi',
    farm_name: 'Gir Gaushala Naturals',
    title: 'Pure A2 Gir Cow Fresh Raw Milk',
    slug: 'pure-a2-gir-cow-fresh-raw-milk',
    category_id: 'cat-dairy',
    category_name: 'Dairy Products',
    description: 'Untouched raw milk from free-grazing indigenous Gir cows. Naturally contains pure A2 beta-casein protein and zero hormones or antibiotics.',
    benefits: ['Pure A2 Beta-Casein Protein', 'Cruelty-free free-grazing cows', 'Chilled immediately after morning milking'],
    nutrition: { calories: '64 kcal', protein: '3.4g', carbs: '4.8g', fats: '3.6g' },
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
    ],
    price: 85,
    unit: 'litre',
    stock_qty: 40,
    is_organic: true,
    badges: ['A2 Certified', 'Hormone Free'],
    rating_avg: 4.98,
    rating_count: 110,
    status: 'active',
    created_at: '2026-03-08T06:00:00Z',
  },
  {
    id: 'p-dairy-2',
    farmer_id: 'f-4',
    farmer_name: 'Devendra Joshi',
    farm_name: 'Gir Gaushala Naturals',
    title: 'Handcrafted Desi Cow Milk Paneer',
    slug: 'handcrafted-desi-cow-milk-paneer',
    category_id: 'cat-dairy',
    category_name: 'Dairy Products',
    description: 'Soft, melt-in-mouth cottage cheese curdled naturally with lemon juice without chemical coagulants or starch fillers.',
    benefits: ['Zero chemical coagulants', 'Rich in natural milk protein', 'Extremely soft & tender texture'],
    nutrition: { calories: '265 kcal', protein: '18.3g', carbs: '1.2g', fats: '20.8g' },
    images: [
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
    ],
    price: 130,
    unit: '200g pack',
    stock_qty: 30,
    is_organic: true,
    badges: ['Freshly Curdled', 'No Starch'],
    rating_avg: 4.95,
    rating_count: 65,
    status: 'active',
    created_at: '2026-03-08T06:30:00Z',
  },
  {
    id: 'p-dairy-3',
    farmer_id: 'f-4',
    farmer_name: 'Devendra Joshi',
    farm_name: 'Gir Gaushala Naturals',
    title: 'Traditional Vedic Bilona A2 Cow Ghee',
    slug: 'traditional-vedic-bilona-a2-cow-ghee',
    category_id: 'cat-dairy',
    category_name: 'Dairy Products',
    description: 'Prepared using ancient 5-step Bilona method: cultured whole curd hand-churned with wooden madhani and slow-simmered over cow dung embers.',
    benefits: ['Authentic Ayurvedic Bilona method', 'Rich golden granular texture', 'Contains Butyric acid & fat-soluble vitamins'],
    nutrition: { calories: '884 kcal', protein: '0g', carbs: '0g', fats: '99.8g' },
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800',
    ],
    price: 1450,
    unit: '500ml jar',
    stock_qty: 50,
    is_organic: true,
    badges: ['Vedic Bilona', 'A2 Golden Ghee'],
    rating_avg: 5.0,
    rating_count: 140,
    status: 'active',
    created_at: '2026-03-01T10:00:00Z',
  },

  // --- SPICES ---
  {
    id: 'p-spice-1',
    farmer_id: 'f-2',
    farmer_name: 'Abdul Rashid Mir',
    farm_name: 'Kashmir Valley Organics',
    title: 'Pure Kashmiri Mongra Saffron (Grade A1)',
    slug: 'pure-kashmiri-mongra-saffron-grade-a1',
    category_id: 'cat-spices',
    category_name: 'Spices',
    description: 'Pure red saffron stigmata cultivated in the unique lacustrine plateau soil of Pampore, Kashmir. World renowned for highest crocin color and safranal aroma.',
    benefits: ['Grade A1 Mongra stigmata only', 'Direct from saffron growers of Pampore', 'Highest natural coloring strength'],
    nutrition: { calories: '310 kcal', protein: '11.4g', carbs: '65g', fats: '5.8g' },
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
    ],
    price: 490,
    unit: '1g box',
    stock_qty: 100,
    is_organic: true,
    badges: ['Pampore GI Tag', 'Laboratory Certified'],
    rating_avg: 5.0,
    rating_count: 185,
    status: 'active',
    created_at: '2026-02-15T09:00:00Z',
  },
  {
    id: 'p-spice-2',
    farmer_id: 'f-2',
    farmer_name: 'Abdul Rashid Mir',
    farm_name: 'Kashmir Valley Organics',
    title: 'High-Curcumin Lakadong Turmeric Powder',
    slug: 'high-curcumin-lakadong-turmeric-powder',
    category_id: 'cat-spices',
    category_name: 'Spices',
    description: 'Known as the finest turmeric on Earth, grown in the Jaintia Hills with an extraordinary 7.5%+ natural curcumin percentage.',
    benefits: ['7.5%+ natural curcumin content', 'Triple-tested for zero lead chromate', 'Potent anti-inflammatory properties'],
    nutrition: { calories: '354 kcal', protein: '7.8g', carbs: '64.9g', fats: '9.9g' },
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=800',
    ],
    price: 165,
    unit: '250g jar',
    stock_qty: 80,
    is_organic: true,
    badges: ['7.5% Curcumin', 'Lead-Free'],
    rating_avg: 4.95,
    rating_count: 92,
    status: 'active',
    created_at: '2026-02-28T11:00:00Z',
  },
  {
    id: 'p-spice-3',
    farmer_id: 'f-2',
    farmer_name: 'Abdul Rashid Mir',
    farm_name: 'Kashmir Valley Organics',
    title: 'Malabar Bold Green Cardamom (8mm+)',
    slug: 'malabar-bold-green-cardamom-8mm',
    category_id: 'cat-spices',
    category_name: 'Spices',
    description: 'Plump extra-bold green cardamom pods handpicked in the Western Ghats. Sun-dried slowly to preserve essential oils.',
    benefits: ['8mm+ extra bold pods', 'Naturally sun-dried green', 'Intense sweet minty aroma'],
    nutrition: { calories: '311 kcal', protein: '10.8g', carbs: '68.5g', fats: '6.7g' },
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    ],
    price: 260,
    unit: '100g pack',
    stock_qty: 65,
    is_organic: true,
    badges: ['8mm Extra Bold', 'Sun Dried'],
    rating_avg: 4.88,
    rating_count: 54,
    status: 'active',
    created_at: '2026-03-01T12:00:00Z',
  },

  // --- OTHER AGRICULTURAL PRODUCTS ---
  {
    id: 'p-other-1',
    farmer_id: 'f-3',
    farmer_name: 'Gurpreet Singh',
    farm_name: 'Punjab Bio Fields',
    title: 'Cold Pressed Wood-Churned Mustard Oil (Kachi Ghani)',
    slug: 'cold-pressed-wood-churned-mustard-oil',
    category_id: 'cat-other',
    category_name: 'Other Agricultural Products',
    description: 'Extracted in wooden kohlus below 45°C without chemical solvents or petroleum refining. Preserves pungent natural pungency and antioxidants.',
    benefits: ['Zero chemical solvents or argemone', 'Cold wood pressed below 45°C', 'High natural smoke point'],
    nutrition: { calories: '884 kcal', protein: '0g', carbs: '0g', fats: '100g' },
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    ],
    price: 240,
    unit: '1 Litre bottle',
    stock_qty: 110,
    is_organic: true,
    badges: ['Wood Churned', 'Cold Pressed'],
    rating_avg: 4.9,
    rating_count: 76,
    status: 'active',
    created_at: '2026-03-03T14:00:00Z',
  },
  {
    id: 'p-other-2',
    farmer_id: 'f-2',
    farmer_name: 'Abdul Rashid Mir',
    farm_name: 'Kashmir Valley Organics',
    title: 'Raw Unprocessed Wild Forest Honey',
    slug: 'raw-unprocessed-wild-forest-honey',
    category_id: 'cat-other',
    category_name: 'Other Agricultural Products',
    description: 'Pure multi-flora honey collected by indigenous forest gatherers. Never heated, ultra-filtered, or adulterated with sugar syrups.',
    benefits: ['Raw & unheated with live pollen', 'Zero C3/C4 corn syrup adulteration', 'Rich enzymes and floral aroma'],
    nutrition: { calories: '304 kcal', protein: '0.3g', carbs: '82.4g', fats: '0g' },
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    ],
    price: 380,
    unit: '500g jar',
    stock_qty: 55,
    is_organic: true,
    badges: ['Raw & Unheated', 'Forest Flora'],
    rating_avg: 4.96,
    rating_count: 82,
    status: 'active',
    created_at: '2026-03-04T15:00:00Z',
  },
  {
    id: 'p-other-3',
    farmer_id: 'f-1',
    farmer_name: 'Rajesh Patel',
    farm_name: 'Patel Organic Farms',
    title: 'Enriched Bio-Organic Vermicompost',
    slug: 'enriched-bio-organic-vermicompost',
    category_id: 'cat-other',
    category_name: 'Other Agricultural Products',
    description: '100% natural organic soil conditioner digested by Eisenia Fetida earthworms. Enriched with neem cake and beneficial microbes for home gardens.',
    benefits: ['Loaded with soil microbiomes & humic acid', 'Zero weed seeds or odor', 'Safe for all organic vegetables & flowers'],
    nutrition: {},
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    ],
    price: 180,
    unit: '5kg bag',
    stock_qty: 140,
    is_organic: true,
    badges: ['Neem Enriched', 'Garden Gold'],
    rating_avg: 4.8,
    rating_count: 34,
    status: 'active',
    created_at: '2026-03-05T16:00:00Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'AGRO-2026-1001',
    user_id: 'c-1',
    items: [
      {
        product_id: 'p-veg-1',
        title: 'Farm Fresh Organic Tomatoes',
        price: 45,
        qty: 2,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      },
      {
        product_id: 'p-dairy-3',
        title: 'Traditional Vedic Bilona A2 Cow Ghee',
        price: 1450,
        qty: 1,
        unit: '500ml jar',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800',
      },
    ],
    address: {
      label: 'Home',
      line1: 'Flat 402, Green Meadows, MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    subtotal: 1540,
    gst: 77,
    delivery_fee: 0,
    discount: 50,
    total: 1567,
    payment_status: 'paid',
    order_status: 'shipped',
    payment_method: 'razorpay',
    created_at: '2026-03-22T10:14:00Z',
  },
  {
    id: 'ord-102',
    order_number: 'AGRO-2026-1002',
    user_id: 'c-1',
    items: [
      {
        product_id: 'p-spice-1',
        title: 'Pure Kashmiri Mongra Saffron (Grade A1)',
        price: 490,
        qty: 1,
        unit: '1g box',
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
      },
      {
        product_id: 'p-fruit-1',
        title: 'Kashmiri Royal Delicious Red Apples',
        price: 180,
        qty: 2,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800',
      },
    ],
    address: {
      label: 'Home',
      line1: 'Flat 402, Green Meadows, MG Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    subtotal: 850,
    gst: 42.5,
    delivery_fee: 40,
    discount: 0,
    total: 932.5,
    payment_status: 'paid',
    order_status: 'placed',
    payment_method: 'razorpay',
    created_at: '2026-03-24T08:30:00Z',
  },
  {
    id: 'ord-103',
    order_number: 'AGRO-2026-1003',
    user_id: 'c-2',
    items: [
      {
        product_id: 'p-grain-1',
        title: 'Royal Himalayan Organic Basmati Rice',
        price: 195,
        qty: 2,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
      },
      {
        product_id: 'p-other-1',
        title: 'Cold Pressed Wood-Churned Mustard Oil',
        price: 240,
        qty: 1,
        unit: '1 Litre bottle',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
      },
    ],
    address: {
      label: 'Office',
      line1: 'Tower B, Cyber Hub, DLF Phase 2',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
    },
    subtotal: 630,
    gst: 31.5,
    delivery_fee: 40,
    discount: 0,
    total: 701.5,
    payment_status: 'pending_cod',
    order_status: 'packed',
    payment_method: 'cod',
    created_at: '2026-03-23T14:45:00Z',
  },
  {
    id: 'ord-104',
    order_number: 'AGRO-2026-1004',
    user_id: 'c-3',
    items: [
      {
        product_id: 'p-dairy-1',
        title: 'Pure A2 Gir Cow Fresh Raw Milk',
        price: 85,
        qty: 4,
        unit: 'litre',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
      },
      {
        product_id: 'p-dairy-2',
        title: 'Handcrafted Desi Cow Milk Paneer',
        price: 130,
        qty: 2,
        unit: '200g pack',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
      },
    ],
    address: {
      label: 'Home',
      line1: '12 Park Street, Near South City',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
    subtotal: 600,
    gst: 30,
    delivery_fee: 0,
    discount: 30,
    total: 600,
    payment_status: 'paid',
    order_status: 'delivered',
    payment_method: 'razorpay',
    created_at: '2026-03-20T11:20:00Z',
  },
];

interface AgroState {
  products: Product[];
  categories: Category[];
  farmers: FarmerProfile[];
  customers: CustomerProfile[];
  orders: Order[];
  wishlist: Record<string, string[]>; // userId -> productIds[]
  addresses: Record<string, Address[]>; // userId -> addresses
}

let memoryState: AgroState | null = null;

function loadState(): AgroState {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } else if (memoryState) {
      return memoryState;
    }
  } catch (e) {
    console.error('Failed reading localStorage', e);
  }

  const initial: AgroState = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    farmers: INITIAL_FARMERS,
    customers: INITIAL_CUSTOMERS,
    orders: INITIAL_ORDERS,
    wishlist: {
      'c-1': ['p-spice-1', 'p-dairy-3', 'p-fruit-1'],
    },
    addresses: {
      'c-1': [
        {
          id: 'addr-1',
          label: 'Home',
          line1: 'Flat 402, Green Meadows, MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          is_default: true,
        },
        {
          id: 'addr-2',
          label: 'Parents House',
          line1: 'Plot 18, Shanti Kunj, Model Colony',
          city: 'Nashik',
          state: 'Maharashtra',
          pincode: '422005',
          is_default: false,
        },
      ],
    },
  };
  saveState(initial);
  return initial;
}

function saveState(state: AgroState) {
  memoryState = state;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Failed saving localStorage', e);
  }
}


export const DataService = {
  // PRODUCTS
  getProducts(filters?: {
    category?: string;
    search?: string;
    isOrganic?: boolean;
    maxPrice?: number;
    sort?: string;
    farmerId?: string;
  }): Product[] {
    const state = loadState();
    let res = [...state.products];

    if (filters?.farmerId) {
      res = res.filter((p) => p.farmer_id === filters.farmerId);
      return res;
    }

    if (filters?.category) {
      const slug = filters.category.toLowerCase();
      // Match category slug or id or grains/seeds aliases
      if (slug === 'seeds-grains' || slug === 'grains-seeds') {
        res = res.filter((p) => p.category_id === 'cat-grains' || p.category_id === 'cat-seeds');
      } else {
        const cat = state.categories.find((c) => c.slug === slug || c.id === slug);
        if (cat) {
          res = res.filter((p) => p.category_id === cat.id);
        } else {
          res = res.filter((p) => p.category_name?.toLowerCase().includes(slug));
        }
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.farm_name?.toLowerCase().includes(q)
      );
    }

    if (filters?.isOrganic !== undefined) {
      res = res.filter((p) => p.is_organic === filters.isOrganic);
    }

    if (filters?.maxPrice !== undefined) {
      res = res.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.sort) {
      if (filters.sort === 'price_low') {
        res.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_high') {
        res.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating') {
        res.sort((a, b) => b.rating_avg - a.rating_avg);
      } else if (filters.sort === 'newest') {
        res.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      }
    }

    return res;
  },

  getFeaturedProducts(): Product[] {
    const state = loadState();
    return [...state.products].filter((p) => p.status === 'active').sort((a, b) => b.rating_avg - a.rating_avg).slice(0, 8);
  },

  getProductBySlugOrId(slugOrId: string): Product | null {
    const state = loadState();
    return state.products.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
  },

  addProduct(newProduct: Partial<Product>): Product {
    const state = loadState();
    const id = `p-user-${Date.now()}`;
    const slug = (newProduct.title || 'organic-harvest')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const p: Product = {
      id,
      farmer_id: newProduct.farmer_id || 'f-1',
      farmer_name: newProduct.farmer_name || 'Green Valley Farmer',
      farm_name: newProduct.farm_name || 'AgroMart Organic Farm',
      title: newProduct.title || 'Fresh Harvest',
      slug,
      category_id: newProduct.category_id || 'cat-veg',
      category_name: newProduct.category_name || 'Vegetables',
      description: newProduct.description || 'Pure farm harvest grown with care.',
      benefits: newProduct.benefits || ['100% Certified Organic', 'Freshly Harvested'],
      nutrition: newProduct.nutrition || { calories: '30 kcal', protein: '1.2g', carbs: '6g', fats: '0.2g' },
      images: newProduct.images?.length
        ? newProduct.images
        : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'],
      price: Number(newProduct.price) || 50,
      unit: newProduct.unit || 'kg',
      stock_qty: Number(newProduct.stock_qty) || 50,
      is_organic: newProduct.is_organic !== undefined ? Boolean(newProduct.is_organic) : true,
      badges: newProduct.badges || ['Farm Fresh'],
      rating_avg: 4.8,
      rating_count: 1,
      status: newProduct.status || 'active',
      created_at: new Date().toISOString(),
    };

    state.products.unshift(p);
    saveState(state);
    return p;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const state = loadState();
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    state.products[idx] = {
      ...state.products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : state.products[idx].price,
      stock_qty: updates.stock_qty !== undefined ? Number(updates.stock_qty) : state.products[idx].stock_qty,
    };
    saveState(state);
    return state.products[idx];
  },

  deleteProduct(id: string): boolean {
    const state = loadState();
    const lenBefore = state.products.length;
    state.products = state.products.filter((p) => p.id !== id);
    if (state.products.length !== lenBefore) {
      saveState(state);
      return true;
    }
    return false;
  },

  // CATEGORIES
  getCategories(): Category[] {
    const state = loadState();
    return state.categories;
  },

  addCategory(name: string, slug: string, icon: string = 'eco'): Category {
    const state = loadState();
    const id = `cat-${Date.now()}`;
    const newCat: Category = { id, name, slug, icon };
    state.categories.push(newCat);
    saveState(state);
    return newCat;
  },

  // FARMERS
  getFarmers(): FarmerProfile[] {
    const state = loadState();
    return state.farmers;
  },

  getFarmerById(farmerId: string): FarmerProfile | null {
    const state = loadState();
    return state.farmers.find((f) => f.id === farmerId || f.user_id === farmerId) || null;
  },

  approveFarmer(farmerId: string): FarmerProfile | null {
    const state = loadState();
    const farmer = state.farmers.find((f) => f.id === farmerId || f.user_id === farmerId);
    if (farmer) {
      farmer.status = 'approved';
      saveState(state);
      return farmer;
    }
    return null;
  },

  rejectFarmer(farmerId: string): FarmerProfile | null {
    const state = loadState();
    const farmer = state.farmers.find((f) => f.id === farmerId || f.user_id === farmerId);
    if (farmer) {
      farmer.status = 'rejected';
      saveState(state);
      return farmer;
    }
    return null;
  },

  toggleFarmerStatus(farmerId: string): FarmerProfile | null {
    const state = loadState();
    const farmer = state.farmers.find((f) => f.id === farmerId || f.user_id === farmerId);
    if (farmer) {
      farmer.status = farmer.status === 'suspended' ? 'approved' : 'suspended';
      saveState(state);
      return farmer;
    }
    return null;
  },

  updateFarmerStatus(
    farmerId: string,
    status: 'pending_approval' | 'approved' | 'rejected' | 'suspended'
  ): FarmerProfile | null {
    const state = loadState();
    const farmer = state.farmers.find((f) => f.id === farmerId || f.user_id === farmerId);
    if (farmer) {
      farmer.status = status;
      saveState(state);
      return farmer;
    }
    return null;
  },


  registerFarmer(data: Partial<FarmerProfile>): FarmerProfile {
    const state = loadState();
    const id = `f-${Date.now()}`;
    const newFarmer: FarmerProfile = {
      id,
      user_id: data.user_id || `u-${Date.now()}`,
      name: data.name || 'New Farmer',
      email: data.email || '',
      phone: data.phone || '',
      farm_name: data.farm_name || 'My Organic Farm',
      village: data.village || '',
      district: data.district || '',
      state: data.state || '',
      category: data.category || 'Vegetables',
      farming_type: data.farming_type || '100% Organic',
      verification_details: data.verification_details || 'Pending Verification',
      status: 'pending_approval',
      rating: 0,
      total_sales: 0,
      orders_count: 0,
      created_at: new Date().toISOString(),
    };
    state.farmers.push(newFarmer);
    saveState(state);
    return newFarmer;
  },

  // CUSTOMERS
  getCustomers(): CustomerProfile[] {
    const state = loadState();
    return state.customers;
  },

  toggleCustomerStatus(customerId: string): CustomerProfile | null {
    const state = loadState();
    const c = state.customers.find((cust) => cust.id === customerId);
    if (c) {
      c.status = c.status === 'suspended' ? 'active' : 'suspended';
      saveState(state);
      return c;
    }
    return null;
  },

  // ORDERS & STOCK
  getOrders(userId?: string, farmerId?: string): Order[] {
    const state = loadState();
    let res = [...state.orders];

    if (userId) {
      res = res.filter((o) => o.user_id === userId || o.user_id === 'c-1');
    }

    if (farmerId) {
      // Find products belonging to this farmer
      const farmerProductIds = new Set(
        state.products.filter((p) => p.farmer_id === farmerId).map((p) => p.id)
      );
      res = res.filter((o) => o.items.some((item) => farmerProductIds.has(item.product_id)));
    }

    return res.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  },

  getOrderById(orderId: string): Order | null {
    const state = loadState();
    return state.orders.find((o) => o.id === orderId || o.order_number === orderId) || null;
  },

  createOrder(orderData: Partial<Order>): Order {
    const state = loadState();
    const id = `ord-${Date.now()}`;
    const orderNumber = `AGRO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id,
      order_number: orderNumber,
      user_id: orderData.user_id || 'c-1',
      items: orderData.items || [],
      address: orderData.address || {
        label: 'Home',
        line1: 'Farm Colony Road',
        city: 'Nashik',
        state: 'Maharashtra',
        pincode: '422001',
      },
      subtotal: orderData.subtotal || 0,
      gst: orderData.gst || 0,
      delivery_fee: orderData.delivery_fee || 0,
      discount: orderData.discount || 0,
      total: orderData.total || 0,
      payment_status: orderData.payment_status || 'paid',
      order_status: 'placed',
      payment_method: orderData.payment_method || 'razorpay',
      created_at: new Date().toISOString(),
    };

    // CRITICAL: Decrease product stock accordingly
    for (const item of newOrder.items) {
      const prod = state.products.find((p) => p.id === item.product_id);
      if (prod) {
        prod.stock_qty = Math.max(0, prod.stock_qty - item.qty);
      }
    }

    // Update customer stats
    const cust = state.customers.find((c) => c.id === newOrder.user_id);
    if (cust) {
      cust.total_orders += 1;
      cust.total_spent += newOrder.total;
    }

    state.orders.unshift(newOrder);
    saveState(state);
    return newOrder;
  },

  updateOrderStatus(
    orderId: string,
    newStatus: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  ): Order | null {
    const state = loadState();
    const order = state.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) return null;

    order.order_status = newStatus;
    if (newStatus === 'cancelled') {
      // Restore stock
      for (const item of order.items) {
        const prod = state.products.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_qty += item.qty;
        }
      }
    }
    saveState(state);
    return order;
  },

  // STATS
  getAdminStats() {
    const state = loadState();
    const totalRevenue = state.orders
      .filter((o) => o.payment_status === 'paid' && o.order_status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = state.orders.filter((o) => o.order_status === 'placed').length;
    const pendingFarmers = state.farmers.filter((f) => f.status === 'pending_approval').length;

    return {
      total_users: state.customers.length + state.farmers.length + 1,
      total_customers: state.customers.length,
      total_farmers: state.farmers.length,
      total_products: state.products.length,
      total_orders: state.orders.length,
      total_revenue: totalRevenue,
      pending_orders: pendingOrders,
      pending_farmers: pendingFarmers,
    };
  },

  getFarmerStats(farmerId: string) {
    const state = loadState();
    const farmerProducts = state.products.filter((p) => p.farmer_id === farmerId);
    const farmerProductIds = new Set(farmerProducts.map((p) => p.id));

    const farmerOrders = state.orders.filter((o) =>
      o.items.some((item) => farmerProductIds.has(item.product_id))
    );

    let totalSales = 0;
    let itemsSold = 0;
    for (const o of farmerOrders) {
      for (const item of o.items) {
        if (farmerProductIds.has(item.product_id)) {
          totalSales += item.price * item.qty;
          itemsSold += item.qty;
        }
      }
    }

    const availableStock = farmerProducts.reduce((sum, p) => sum + p.stock_qty, 0);
    const pendingOrders = farmerOrders.filter((o) => o.order_status === 'placed').length;

    return {
      total_products: farmerProducts.length,
      total_orders: farmerOrders.length,
      total_sales: totalSales,
      pending_orders: pendingOrders,
      available_stock: availableStock,
      items_sold: itemsSold,
    };
  },

  // WISHLIST
  getWishlist(userId: string): Product[] {
    const state = loadState();
    const ids = state.wishlist[userId] || state.wishlist['c-1'] || [];
    return state.products.filter((p) => ids.includes(p.id));
  },

  toggleWishlist(userId: string, productId: string): boolean {
    const state = loadState();
    if (!state.wishlist[userId]) {
      state.wishlist[userId] = [];
    }
    const idx = state.wishlist[userId].indexOf(productId);
    let isAdded = false;
    if (idx >= 0) {
      state.wishlist[userId].splice(idx, 1);
    } else {
      state.wishlist[userId].push(productId);
      isAdded = true;
    }
    saveState(state);
    return isAdded;
  },

  // ADDRESSES
  getAddresses(userId: string): Address[] {
    const state = loadState();
    return state.addresses[userId] || state.addresses['c-1'] || [];
  },

  addAddress(userId: string, addr: Omit<Address, 'id'>): Address {
    const state = loadState();
    if (!state.addresses[userId]) {
      state.addresses[userId] = [];
    }
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    if (newAddr.is_default) {
      state.addresses[userId].forEach((a) => (a.is_default = false));
    }
    state.addresses[userId].push(newAddr);
    saveState(state);
    return newAddr;
  },

  deleteAddress(userId: string, addressId: string): boolean {
    const state = loadState();
    if (!state.addresses[userId]) return false;
    const initialLen = state.addresses[userId].length;
    state.addresses[userId] = state.addresses[userId].filter((a) => a.id !== addressId);
    if (state.addresses[userId].length !== initialLen) {
      saveState(state);
      return true;
    }
    return false;
  },

  // RESET
  resetDemoData() {
    memoryState = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed clearing localStorage', e);
    }
    return loadState();
  },
};


export const dataService = DataService;

