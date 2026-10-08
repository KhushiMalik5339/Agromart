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

const STORAGE_KEY = 'agromart_db_v4';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-fruits', name: 'Fruits', slug: 'fruits', icon: 'nutrition' },
  { id: 'cat-veg', name: 'Vegetables', slug: 'vegetables', icon: 'eco' },
  { id: 'cat-grains', name: 'Grains & Cereals', slug: 'grains', icon: 'grain' },
  { id: 'cat-pulses', name: 'Pulses & Legumes', slug: 'pulses', icon: 'lunch_dining' },
  { id: 'cat-dairy', name: 'Dairy & Milk Products', slug: 'dairy', icon: 'egg' },
  { id: 'cat-spices', name: 'Spices & Condiments', slug: 'spices', icon: 'local_florist' },
  { id: 'cat-oils', name: 'Oilseeds & Edible Oils', slug: 'oilseeds-oils', icon: 'opacity' },
  { id: 'cat-dry-fruits', name: 'Dry Fruits & Nuts', slug: 'dry-fruits', icon: 'cookie' },
  { id: 'cat-seeds', name: 'Seeds', slug: 'seeds', icon: 'spa' },
  { id: 'cat-fertilizers', name: 'Fertilizers & Manure', slug: 'fertilizers', icon: 'science' },
  { id: 'cat-equipment', name: 'Agricultural Tools & Equipment', slug: 'equipment', icon: 'precision_manufacturing' },
  { id: 'cat-plants', name: 'Flowers & Plants', slug: 'plants', icon: 'yard' },
  { id: 'cat-organic', name: 'Organic Products', slug: 'organic', icon: 'verified' },
  { id: 'cat-other', name: 'Other Agricultural Products', slug: 'other-agriculture', icon: 'agriculture' },
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
    category: 'Vegetables & Fruits',
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
    category: 'Spices & Dry Fruits',
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
    category: 'Grains & Pulses',
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
    name: 'Suresh Verma',
    email: 'verma.kisan@agromart.com',
    phone: '+91 98120 77334',
    farm_name: 'Panipat Kisan Bio-Farms',
    village: 'Samalkha',
    district: 'Panipat',
    state: 'Haryana',
    category: 'Vegetables & Seeds',
    farming_type: 'Natural Vedic Jaivik Krishi',
    verification_details: 'HR-PANIPAT-KISAN-902',
    status: 'approved',
    rating: 4.9,
    total_sales: 172000,
    orders_count: 79,
    created_at: '2025-12-15T09:00:00Z',
  },
  {
    id: 'f-6',
    user_id: 'u-farmer-6',
    name: 'Baldev Singh Dhillon',
    email: 'karnal.paddy@agromart.com',
    phone: '+91 94160 88219',
    farm_name: 'Karnal Basmati Heritage Farms',
    village: 'Taraori',
    district: 'Karnal',
    state: 'Haryana',
    category: 'Grains & Basmati Rice',
    farming_type: 'Heritage Organic Crop Rotation',
    verification_details: 'HR-KARNAL-BASMATI-411',
    status: 'approved',
    rating: 4.92,
    total_sales: 234000,
    orders_count: 91,
    created_at: '2025-11-20T10:30:00Z',
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
    total_spent: 2800,
  },
  {
    id: 'c-3',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@yahoo.com',
    phone: '+91 99201 44556',
    status: 'active',
    created_at: '2026-03-01T08:45:00Z',
    total_orders: 2,
    total_spent: 1950,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "p-fr-1",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Devgad, Maharashtra",
    "title": "Fresh Ratnagiri Alphonso Mango (Hapus)",
    "slug": "fresh-ratnagiri-alphonso-mango-hapus",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Fresh Fruits",
    "description": "Naturally tree-ripened Konkan Alphonso mangoes with rich aroma, golden buttery pulp, and divine sweetness. 100% carbide-free.",
    "benefits": [
      "Naturally Tree-Ripened",
      "Geographical Indication (GI) Tagged",
      "Carbide-Free"
    ],
    "nutrition": {
      "calories": "60 kcal/100g",
      "protein": "0.8g",
      "carbs": "15g",
      "fats": "0.4g"
    },
    "specifications": {
      "Origin": "Devgad, Maharashtra",
      "Grade": "Grade A+ Export",
      "Shelf Life": "5-7 Days"
    },
    "shelf_life": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 899,
    "original_price": 1099,
    "discount": 18,
    "unit": "dozen",
    "stock_qty": 45,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "GI Tagged",
      "Carbide Free"
    ],
    "tags": [
      "mango",
      "alphonso",
      "fruits",
      "organic"
    ],
    "rating_avg": 4.95,
    "rating_count": 92,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-2",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Shopian, Kashmir",
    "title": "Kashmiri Royal Delicious Red Apples",
    "slug": "kashmiri-royal-delicious-red-apples",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Fresh Fruits",
    "description": "Crisp, sweet, high-altitude Kashmiri apples harvested from snow-fed valley orchards without synthetic wax coating.",
    "benefits": [
      "Naturally Wax-Free",
      "High Dietary Fiber & Vitamin C",
      "Crisp Natural Sweetness"
    ],
    "nutrition": {
      "calories": "52 kcal/100g",
      "protein": "0.3g",
      "carbs": "14g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Shopian, Kashmir",
      "Altitude": "2100m",
      "Shelf Life": "14 Days"
    },
    "shelf_life": "14 Days",
    "images": [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 180,
    "original_price": 220,
    "discount": 18,
    "unit": "kg",
    "stock_qty": 85,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Wax Free",
      "Kashmiri"
    ],
    "tags": [
      "apple",
      "kashmir",
      "fruits"
    ],
    "rating_avg": 4.9,
    "rating_count": 88,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-3",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Jalgaon, Maharashtra",
    "title": "Robusta Farm-Fresh Yellow Bananas",
    "slug": "robusta-farm-fresh-yellow-bananas",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Fresh Fruits",
    "description": "Naturally ripened sweet Robusta bananas rich in potassium and energy. Sourced directly from Jalgaon banana belt.",
    "benefits": [
      "Instant Energy Boost",
      "High Potassium & Vitamin B6",
      "Zero Chemical Ripening"
    ],
    "nutrition": {
      "calories": "89 kcal/100g",
      "protein": "1.1g",
      "carbs": "23g",
      "fats": "0.3g"
    },
    "specifications": {
      "Origin": "Jalgaon, Maharashtra",
      "Shelf Life": "4-5 Days"
    },
    "shelf_life": "4-5 Days",
    "images": [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 55,
    "original_price": 70,
    "discount": 21,
    "unit": "dozen",
    "stock_qty": 120,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Carbide Free"
    ],
    "tags": [
      "banana",
      "fresh",
      "fruits"
    ],
    "rating_avg": 4.8,
    "rating_count": 64,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-4",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Nagpur, Maharashtra",
    "title": "Nagpur Sweet Mandarin Oranges",
    "slug": "nagpur-sweet-mandarin-oranges",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Citrus Fruits",
    "description": "Juicy, tangy-sweet GI-tagged Nagpur oranges bursting with natural Vitamin C and immunity-boosting antioxidants.",
    "benefits": [
      "Rich in Vitamin C",
      "Juicy Thin Peel",
      "GI Tagged Origin"
    ],
    "nutrition": {
      "calories": "47 kcal/100g",
      "protein": "0.9g",
      "carbs": "12g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Nagpur, Maharashtra",
      "Shelf Life": "7 Days"
    },
    "shelf_life": "7 Days",
    "images": [
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 80,
    "original_price": 100,
    "discount": 20,
    "unit": "kg",
    "stock_qty": 95,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Nagpur GI",
      "Vitamin C"
    ],
    "tags": [
      "orange",
      "citrus",
      "fruits"
    ],
    "rating_avg": 4.85,
    "rating_count": 52,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-5",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Nashik, Maharashtra",
    "title": "Fresh Sonaka Seedless Green Grapes",
    "slug": "fresh-sonaka-seedless-green-grapes",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Fresh Fruits",
    "description": "Crisp, elongated Sonaka green grapes with balanced sweetness and zero pesticide residue, hand-picked in Nashik.",
    "benefits": [
      "Zero Residue Farming",
      "Natural Antioxidants",
      "Thin Crispy Skin"
    ],
    "nutrition": {
      "calories": "69 kcal/100g",
      "protein": "0.7g",
      "carbs": "18g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Nashik, Maharashtra",
      "Shelf Life": "5 Days"
    },
    "shelf_life": "5 Days",
    "images": [
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 95,
    "original_price": 120,
    "discount": 21,
    "unit": "500g",
    "stock_qty": 65,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": false,
    "badges": [
      "Nashik Harvest"
    ],
    "tags": [
      "grapes",
      "fresh"
    ],
    "rating_avg": 4.75,
    "rating_count": 41,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-6",
    "farmer_id": "f-4",
    "farmer_name": "Devendra Joshi",
    "farm_name": "Gir Gaushala Naturals",
    "farmer_location": "Kutch, Gujarat",
    "title": "Farm Fresh Red Lady Papaya",
    "slug": "farm-fresh-red-lady-papaya",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Tropical Fruits",
    "description": "Deep red, naturally sweet Taiwan Red Lady papaya rich in papain digestive enzyme and dietary fiber.",
    "benefits": [
      "Supports Digestion",
      "Rich in Beta-Carotene",
      "Naturally Sweet"
    ],
    "nutrition": {
      "calories": "43 kcal/100g",
      "protein": "0.5g",
      "carbs": "11g",
      "fats": "0.3g"
    },
    "specifications": {
      "Origin": "Kutch, Gujarat",
      "Shelf Life": "4 Days"
    },
    "shelf_life": "4 Days",
    "images": [
      "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 50,
    "original_price": 65,
    "discount": 23,
    "unit": "piece",
    "stock_qty": 50,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Farm Fresh"
    ],
    "tags": [
      "papaya",
      "tropical"
    ],
    "rating_avg": 4.7,
    "rating_count": 39,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-7",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Farm Sweet Striped Watermelon",
    "slug": "farm-sweet-striped-watermelon",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Seasonal Fruits",
    "description": "Hydrating, crisp red watermelon grown along the Yamuna fertile plains of Haryana with natural compost.",
    "benefits": [
      "92% Natural Hydration",
      "High Lycopene Content",
      "Chemical Spray Free"
    ],
    "nutrition": {
      "calories": "30 kcal/100g",
      "protein": "0.6g",
      "carbs": "8g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Weight": "3-4 kg avg",
      "Shelf Life": "6 Days"
    },
    "shelf_life": "6 Days",
    "images": [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 35,
    "original_price": 45,
    "discount": 22,
    "unit": "kg",
    "stock_qty": 80,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Haryana Harvest",
      "Sweet & Crisp"
    ],
    "tags": [
      "watermelon",
      "haryana",
      "fruits"
    ],
    "rating_avg": 4.8,
    "rating_count": 54,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-8",
    "farmer_id": "f-6",
    "farmer_name": "Baldev Singh Dhillon",
    "farm_name": "Karnal Basmati Heritage Farms",
    "farmer_location": "Karnal, Haryana",
    "title": "Honey Sweet Muskmelon (Kharbuja)",
    "slug": "honey-sweet-muskmelon-kharbuja",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Seasonal Fruits",
    "description": "Fragrant, golden-orange flesh muskmelon harvested from sandy loam beds of Karnal with intense natural sweetness.",
    "benefits": [
      "Rich in Vitamin A",
      "Cooling & Hydrating",
      "Farm Direct"
    ],
    "nutrition": {
      "calories": "34 kcal/100g",
      "protein": "0.8g",
      "carbs": "8g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Karnal, Haryana",
      "Shelf Life": "5 Days"
    },
    "shelf_life": "5 Days",
    "images": [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 45,
    "original_price": 60,
    "discount": 25,
    "unit": "kg",
    "stock_qty": 60,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": false,
    "badges": [
      "Karnal Direct"
    ],
    "tags": [
      "muskmelon",
      "kharbuja",
      "fruits"
    ],
    "rating_avg": 4.85,
    "rating_count": 36,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-9",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Solapur, Maharashtra",
    "title": "Bhagwa Sweet Ruby Pomegranate",
    "slug": "bhagwa-sweet-ruby-pomegranate",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Fresh Fruits",
    "description": "Deep crimson Bhagwa pomegranates with soft seeds and juicy ruby pearls packed with powerful polyphenols.",
    "benefits": [
      "High Antioxidant Value",
      "Supports Heart Health & Iron Levels",
      "Soft Seeded Variety"
    ],
    "nutrition": {
      "calories": "83 kcal/100g",
      "protein": "1.7g",
      "carbs": "19g",
      "fats": "1.2g"
    },
    "specifications": {
      "Origin": "Solapur, Maharashtra",
      "Shelf Life": "10 Days"
    },
    "shelf_life": "10 Days",
    "images": [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 160,
    "original_price": 200,
    "discount": 20,
    "unit": "kg",
    "stock_qty": 70,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Ruby Bhagwa"
    ],
    "tags": [
      "pomegranate",
      "fruits",
      "organic"
    ],
    "rating_avg": 4.9,
    "rating_count": 78,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-10",
    "farmer_id": "f-4",
    "farmer_name": "Devendra Joshi",
    "farm_name": "Gir Gaushala Naturals",
    "farmer_location": "Gujarat",
    "title": "Red Flesh Organic Dragon Fruit (Pitaya)",
    "slug": "red-flesh-organic-dragon-fruit-pitaya",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Exotic Fruits",
    "description": "Vibrant magenta-fleshed dragon fruit grown organically in semi-arid soils. Rich in prebiotic fiber and iron.",
    "benefits": [
      "Prebiotic Gut Support",
      "Vibrant Natural Anthocyanins",
      "Low Glycemic Index"
    ],
    "nutrition": {
      "calories": "60 kcal/100g",
      "protein": "1.2g",
      "carbs": "13g",
      "fats": "0.6g"
    },
    "specifications": {
      "Origin": "Kutch, Gujarat",
      "Shelf Life": "7 Days"
    },
    "shelf_life": "7 Days",
    "images": [
      "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 140,
    "original_price": 180,
    "discount": 22,
    "unit": "piece",
    "stock_qty": 40,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Exotic Superfood"
    ],
    "tags": [
      "dragonfruit",
      "exotic",
      "fruits"
    ],
    "rating_avg": 4.88,
    "rating_count": 45,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-11",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Mahabaleshwar, Maharashtra",
    "title": "Mahabaleshwar Sweet Strawberries",
    "slug": "mahabaleshwar-sweet-strawberries",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Exotic Fruits",
    "description": "Hand-picked, fragrant crimson strawberries from the mist-covered hill slopes of Mahabaleshwar.",
    "benefits": [
      "Rich in Vitamin C & Manganese",
      "Hand-Harvested Daily",
      "Zero Artificial Sweeteners"
    ],
    "nutrition": {
      "calories": "32 kcal/100g",
      "protein": "0.7g",
      "carbs": "7.7g",
      "fats": "0.3g"
    },
    "specifications": {
      "Origin": "Mahabaleshwar, Maharashtra",
      "Shelf Life": "3-4 Days"
    },
    "shelf_life": "3-4 Days",
    "images": [
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 110,
    "original_price": 140,
    "discount": 21,
    "unit": "200g box",
    "stock_qty": 50,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Mahabaleshwar Origin"
    ],
    "tags": [
      "strawberry",
      "berry",
      "fruits"
    ],
    "rating_avg": 4.92,
    "rating_count": 110,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-12",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Srinagar, Kashmir",
    "title": "Kashmiri Fresh Sweet Dark Cherries",
    "slug": "kashmiri-fresh-sweet-dark-cherries",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Seasonal Fruits",
    "description": "Plump, dark red Himalayan cherries with succulent sweet flesh harvested from Harwan valley orchards.",
    "benefits": [
      "Natural Melatonin for Sleep",
      "Anti-Inflammatory Properties",
      "Short Seasonal Harvest"
    ],
    "nutrition": {
      "calories": "50 kcal/100g",
      "protein": "1.0g",
      "carbs": "12g",
      "fats": "0.3g"
    },
    "specifications": {
      "Origin": "Srinagar, Kashmir",
      "Shelf Life": "5 Days"
    },
    "shelf_life": "5 Days",
    "images": [
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 220,
    "original_price": 275,
    "discount": 20,
    "unit": "250g",
    "stock_qty": 35,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Kashmir Valley"
    ],
    "tags": [
      "cherry",
      "kashmir",
      "fruits"
    ],
    "rating_avg": 4.96,
    "rating_count": 68,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-13",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Wild Desi Black Jamun",
    "slug": "wild-desi-black-jamun",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Seasonal Fruits",
    "description": "Dark purple wild Indian blackberries renowned in Ayurveda for blood sugar management and hemoglobin support.",
    "benefits": [
      "Ayurvedic Blood Sugar Support",
      "Rich in Iron & Potassium",
      "Forest Harvested"
    ],
    "nutrition": {
      "calories": "60 kcal/100g",
      "protein": "0.7g",
      "carbs": "14g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "3 Days"
    },
    "shelf_life": "3 Days",
    "images": [
      "https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 120,
    "original_price": 150,
    "discount": 20,
    "unit": "500g",
    "stock_qty": 30,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": false,
    "badges": [
      "Ayurvedic Jamun"
    ],
    "tags": [
      "jamun",
      "seasonal",
      "fruits"
    ],
    "rating_avg": 4.82,
    "rating_count": 38,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-14",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Dahanu, Maharashtra",
    "title": "Dahanu Sweet Gholvad Chikoo (Sapota)",
    "slug": "dahanu-sweet-gholvad-chikoo-sapota",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Fresh Fruits",
    "description": "GI-tagged Gholvad sapotas with caramel-sweet grainy pulp and rich calcium content grown along Arabian coast.",
    "benefits": [
      "GI Tagged Gholvad Variety",
      "Natural Caramel Sweetness",
      "High Calcium & Iron"
    ],
    "nutrition": {
      "calories": "83 kcal/100g",
      "protein": "0.4g",
      "carbs": "20g",
      "fats": "1.1g"
    },
    "specifications": {
      "Origin": "Dahanu, Maharashtra",
      "Shelf Life": "4-5 Days"
    },
    "shelf_life": "4-5 Days",
    "images": [
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 60,
    "original_price": 75,
    "discount": 20,
    "unit": "kg",
    "stock_qty": 75,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "GI Tagged",
      "Caramel Sweet"
    ],
    "tags": [
      "chikoo",
      "sapota",
      "fruits"
    ],
    "rating_avg": 4.78,
    "rating_count": 42,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-fr-15",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Haryana",
    "title": "Farm Fresh Kagzi Yellow Lemons",
    "slug": "farm-fresh-kagzi-yellow-lemons",
    "category_id": "cat-fruits",
    "category_name": "Fruits",
    "subcategory": "Citrus Fruits",
    "description": "Thin-skinned, extraordinarily juicy Kagzi lemons hand-plucked from sunlit orchards of Haryana.",
    "benefits": [
      "High Citric Acid & Vitamin C",
      "Thin Skin High Juice Yield",
      "Pesticide Free"
    ],
    "nutrition": {
      "calories": "29 kcal/100g",
      "protein": "1.1g",
      "carbs": "9g",
      "fats": "0.3g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "12 Days"
    },
    "shelf_life": "12 Days",
    "images": [
      "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 40,
    "original_price": 50,
    "discount": 20,
    "unit": "250g",
    "stock_qty": 110,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Extra Juicy"
    ],
    "tags": [
      "lemon",
      "citrus",
      "fruits"
    ],
    "rating_avg": 4.85,
    "rating_count": 59,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-1",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Fresh Haryana Red Onion",
    "slug": "fresh-haryana-red-onion",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Bulb Vegetables",
    "description": "Pungent, firm, sun-dried red onions grown in the fertile soils of Panipat. Ideal storage life with intense natural aroma.",
    "benefits": [
      "Rich in Quercetin Antioxidant",
      "Sun-Cured for Long Storage Life",
      "Direct Farm Traceability"
    ],
    "nutrition": {
      "calories": "40 kcal/100g",
      "protein": "1.1g",
      "carbs": "9.3g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Mandi": "Panipat Krishi Mandi",
      "Shelf Life": "21 Days"
    },
    "shelf_life": "21 Days",
    "images": [
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 45,
    "original_price": 55,
    "discount": 18,
    "unit": "kg",
    "stock_qty": 250,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Panipat Direct",
      "Kitchen Staple"
    ],
    "tags": [
      "onion",
      "vegetables",
      "haryana",
      "panipat"
    ],
    "rating_avg": 4.88,
    "rating_count": 120,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-2",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Nashik, Maharashtra",
    "title": "Farm Fresh Organic Tomatoes",
    "slug": "farm-fresh-organic-tomatoes",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Fresh Vegetables",
    "description": "Vine-ripened, naturally sweet organic tomatoes harvested at dawn. Free from synthetic chemicals and artificial ripeners.",
    "benefits": [
      "Rich in Lycopene",
      "High Vitamin C & Potassium",
      "Vine-Ripened Natural Aroma"
    ],
    "nutrition": {
      "calories": "18 kcal/100g",
      "protein": "0.9g",
      "carbs": "3.9g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Nashik, Maharashtra",
      "Shelf Life": "7 Days"
    },
    "shelf_life": "7 Days",
    "images": [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 45,
    "original_price": 55,
    "discount": 18,
    "unit": "kg",
    "stock_qty": 180,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Daily Fresh",
      "Zero Chemical"
    ],
    "tags": [
      "tomato",
      "vegetables",
      "organic"
    ],
    "rating_avg": 4.8,
    "rating_count": 85,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-3",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Ludhiana, Punjab",
    "title": "Mountain Grown Organic Potatoes",
    "slug": "mountain-grown-organic-potatoes",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Root Vegetables",
    "description": "Unpolished earthy potatoes grown in nutrient-dense soil. Zero anti-sprouting chemicals or cold-storage coatings.",
    "benefits": [
      "Complex Natural Carbohydrates",
      "Unpolished & Chemical Free",
      "Earthy Authentic Taste"
    ],
    "nutrition": {
      "calories": "77 kcal/100g",
      "protein": "2.0g",
      "carbs": "17.5g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Ludhiana, Punjab",
      "Shelf Life": "20 Days"
    },
    "shelf_life": "20 Days",
    "images": [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 35,
    "original_price": 45,
    "discount": 22,
    "unit": "kg",
    "stock_qty": 300,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Unpolished",
      "Pesticide Free"
    ],
    "tags": [
      "potato",
      "root",
      "vegetables"
    ],
    "rating_avg": 4.75,
    "rating_count": 92,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-4",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Fresh Baby Spinach (Desi Palak)",
    "slug": "fresh-baby-spinach-desi-palak",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Leafy Vegetables",
    "description": "Tender, crisp iron-rich spinach leaves harvested at daybreak and washed with pure tube-well water. Zero chemical spray.",
    "benefits": [
      "High Natural Iron & Folate",
      "Rich in Vitamins A & K",
      "Harvested Same Morning"
    ],
    "nutrition": {
      "calories": "23 kcal/100g",
      "protein": "2.9g",
      "carbs": "3.6g",
      "fats": "0.4g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "2-3 Days"
    },
    "shelf_life": "2-3 Days",
    "images": [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 30,
    "original_price": 40,
    "discount": 25,
    "unit": "500g",
    "stock_qty": 90,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Morning Harvest"
    ],
    "tags": [
      "spinach",
      "palak",
      "leafy",
      "vegetables"
    ],
    "rating_avg": 4.9,
    "rating_count": 74,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-5",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Delhi Red Sweet Winter Carrots",
    "slug": "delhi-red-sweet-winter-carrots",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Root Vegetables",
    "description": "Crunchy, heirloom desi red carrots with tender core and rich natural sugar content. Perfect for salads and Gajar Halwa.",
    "benefits": [
      "High Beta-Carotene & Vitamin A",
      "Naturally Sweet Desi Variety",
      "Crisp Texture"
    ],
    "nutrition": {
      "calories": "41 kcal/100g",
      "protein": "0.9g",
      "carbs": "9.6g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "8 Days"
    },
    "shelf_life": "8 Days",
    "images": [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 40,
    "original_price": 50,
    "discount": 20,
    "unit": "kg",
    "stock_qty": 140,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Heirloom Red"
    ],
    "tags": [
      "carrot",
      "gajar",
      "root",
      "vegetables"
    ],
    "rating_avg": 4.86,
    "rating_count": 62,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-6",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Tender Farm Green Lauki (Bottle Gourd)",
    "slug": "tender-farm-green-lauki-bottle-gourd",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Gourds",
    "description": "Slender, light-green organic bottle gourd harvested young for maximum juiciness and tender seeds. Easily digestible.",
    "benefits": [
      "Cooling for Body & Liver",
      "Extremely Low Calorie",
      "High Moisture Content"
    ],
    "nutrition": {
      "calories": "14 kcal/100g",
      "protein": "0.6g",
      "carbs": "3.4g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "5 Days"
    },
    "shelf_life": "5 Days",
    "images": [
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 30,
    "original_price": 40,
    "discount": 25,
    "unit": "piece",
    "stock_qty": 75,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Tender Lauki"
    ],
    "tags": [
      "lauki",
      "gourd",
      "vegetables"
    ],
    "rating_avg": 4.75,
    "rating_count": 48,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-7",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Haryana",
    "title": "Tender Desi Okra (Bhindi)",
    "slug": "tender-desi-okra-bhindi",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Fresh Vegetables",
    "description": "Crisp, slender ladyfinger pods picked before maturity to ensure tenderness and zero fiber hardness.",
    "benefits": [
      "Rich in Soluble Fiber",
      "Low Glycemic Index",
      "Zero Pesticide Residue"
    ],
    "nutrition": {
      "calories": "33 kcal/100g",
      "protein": "1.9g",
      "carbs": "7.5g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "4 Days"
    },
    "shelf_life": "4 Days",
    "images": [
      "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 40,
    "original_price": 50,
    "discount": 20,
    "unit": "500g",
    "stock_qty": 85,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Tender Pods"
    ],
    "tags": [
      "bhindi",
      "okra",
      "vegetables"
    ],
    "rating_avg": 4.8,
    "rating_count": 51,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-8",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Punjab",
    "title": "Punjab Sarson Saag Leaves (Mustard Greens)",
    "slug": "punjab-sarson-saag-leaves-mustard-greens",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Leafy Vegetables",
    "description": "Pungent, authentic broad mustard green leaves grown on traditional organic fields of Punjab. Quintessential saag green.",
    "benefits": [
      "Rich in Glucosinolates",
      "High Vitamins C & E",
      "Traditional Winter Crop"
    ],
    "nutrition": {
      "calories": "27 kcal/100g",
      "protein": "2.7g",
      "carbs": "4.7g",
      "fats": "0.4g"
    },
    "specifications": {
      "Origin": "Khanna, Punjab",
      "Shelf Life": "3 Days"
    },
    "shelf_life": "3 Days",
    "images": [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 35,
    "original_price": 45,
    "discount": 22,
    "unit": "500g",
    "stock_qty": 65,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Sarson Saag"
    ],
    "tags": [
      "sarson",
      "saag",
      "leafy",
      "vegetables"
    ],
    "rating_avg": 4.9,
    "rating_count": 67,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-9",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Himachal Pradesh",
    "title": "Shimla Crisp Green Capsicum",
    "slug": "shimla-crisp-green-capsicum",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Fresh Vegetables",
    "description": "Glossy, thick-walled green bell peppers grown in the cool climate of Himachal with juicy crunch.",
    "benefits": [
      "Rich in Antioxidant Vitamin C",
      "Thick Crunchy Walls",
      "Cold-Climate Grown"
    ],
    "nutrition": {
      "calories": "20 kcal/100g",
      "protein": "0.9g",
      "carbs": "4.6g",
      "fats": "0.2g"
    },
    "specifications": {
      "Origin": "Shimla, Himachal Pradesh",
      "Shelf Life": "7 Days"
    },
    "shelf_life": "7 Days",
    "images": [
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 45,
    "original_price": 60,
    "discount": 25,
    "unit": "500g",
    "stock_qty": 80,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Shimla Fresh"
    ],
    "tags": [
      "capsicum",
      "shimlamirch",
      "vegetables"
    ],
    "rating_avg": 4.82,
    "rating_count": 43,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-vg-10",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Crisp Farm Kheera (Cucumber)",
    "slug": "crisp-farm-kheera-cucumber",
    "category_id": "cat-veg",
    "category_name": "Vegetables",
    "subcategory": "Fresh Vegetables",
    "description": "Refreshing, field-grown green cucumber with crunchy texture and cooling hydration.",
    "benefits": [
      "96% Natural Water",
      "Digestive Enzymes",
      "Zero Chemical Coating"
    ],
    "nutrition": {
      "calories": "15 kcal/100g",
      "protein": "0.7g",
      "carbs": "3.6g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Shelf Life": "5 Days"
    },
    "shelf_life": "5 Days",
    "images": [
      "https://images.unsplash.com/photo-1449339854873-750e6913301b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 30,
    "original_price": 40,
    "discount": 25,
    "unit": "kg",
    "stock_qty": 110,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Hydrating Crisp"
    ],
    "tags": [
      "kheera",
      "cucumber",
      "vegetables"
    ],
    "rating_avg": 4.75,
    "rating_count": 46,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-gr-1",
    "farmer_id": "f-6",
    "farmer_name": "Baldev Singh Dhillon",
    "farm_name": "Karnal Basmati Heritage Farms",
    "farmer_location": "Karnal, Haryana",
    "title": "Royal Himalayan Aged 1121 Basmati Rice",
    "slug": "royal-himalayan-aged-1121-basmati-rice",
    "category_id": "cat-grains",
    "category_name": "Grains & Cereals",
    "subcategory": "Rice",
    "description": "Authentic extra-long grain Pusa 1121 Basmati rice, aged naturally for 24 months to yield non-sticky, fragrant grains that elongate to over 20mm when cooked.",
    "benefits": [
      "Aged 2 Years Naturally",
      "Elongates up to 22mm",
      "Geographical Indication Protected",
      "Aromatic Natural Fragrance"
    ],
    "nutrition": {
      "calories": "350 kcal/100g",
      "protein": "8.5g",
      "carbs": "78g",
      "fats": "0.6g"
    },
    "specifications": {
      "Variety": "Pusa 1121 Extra Long",
      "Origin": "Karnal, Haryana",
      "Aging": "24 Months",
      "Shelf Life": "24 Months"
    },
    "shelf_life": "24 Months",
    "images": [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 195,
    "original_price": 240,
    "discount": 19,
    "unit": "kg",
    "stock_qty": 200,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "2-Year Aged",
      "GI Tagged Basmati"
    ],
    "tags": [
      "rice",
      "basmati",
      "karnal",
      "grains"
    ],
    "rating_avg": 4.95,
    "rating_count": 140,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-gr-2",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Ludhiana, Punjab",
    "title": "MP Sharbati Golden Whole Wheat Grain",
    "slug": "mp-sharbati-golden-whole-wheat-grain",
    "category_id": "cat-grains",
    "category_name": "Grains & Cereals",
    "subcategory": "Wheat",
    "description": "The premier grade of Indian wheat, Sharbati grains are heavy, golden, with high natural sweetness and moisture for softer rotis.",
    "benefits": [
      "High Natural Gluten & Moisture",
      "Golden Lustrous Grains",
      "Makes Soft Rotis for 12+ Hours"
    ],
    "nutrition": {
      "calories": "340 kcal/100g",
      "protein": "12.5g",
      "carbs": "71g",
      "fats": "1.7g"
    },
    "specifications": {
      "Origin": "Sehore / Punjab",
      "Grade": "Premium Sharbati",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 55,
    "original_price": 65,
    "discount": 15,
    "unit": "kg",
    "stock_qty": 350,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Sharbati Gehun"
    ],
    "tags": [
      "wheat",
      "sharbati",
      "grains"
    ],
    "rating_avg": 4.9,
    "rating_count": 110,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-gr-3",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Ludhiana, Punjab",
    "title": "100% Sharbati Chakki Fresh Atta",
    "slug": "100-sharbati-chakki-fresh-atta",
    "category_id": "cat-grains",
    "category_name": "Grains & Cereals",
    "subcategory": "Flour & Atta",
    "description": "Stone ground at low RPM to preserve dietary fiber, wheat germ, and essential B-vitamins without maida or preservatives.",
    "benefits": [
      "Stone Ground Cold-Chakki",
      "100% Whole Wheat Bran Included",
      "Zero Additives or Bleach"
    ],
    "nutrition": {
      "calories": "340 kcal/100g",
      "protein": "12.0g",
      "carbs": "72g",
      "fats": "1.8g"
    },
    "specifications": {
      "Origin": "Punjab",
      "Processing": "Stone Chakki",
      "Shelf Life": "3 Months"
    },
    "shelf_life": "3 Months",
    "images": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 245,
    "original_price": 290,
    "discount": 16,
    "unit": "5kg bag",
    "stock_qty": 150,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Chakki Fresh"
    ],
    "tags": [
      "atta",
      "flour",
      "wheat"
    ],
    "rating_avg": 4.88,
    "rating_count": 95,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-gr-4",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Organic Desi Bajra (Pearl Millet)",
    "slug": "organic-desi-bajra-pearl-millet",
    "category_id": "cat-grains",
    "category_name": "Grains & Cereals",
    "subcategory": "Millets",
    "description": "Gluten-free traditional winter pearl millet from Haryana, loaded with iron, zinc, and dietary fiber.",
    "benefits": [
      "Rich in Dietary Iron & Zinc",
      "Naturally 100% Gluten-Free",
      "Warm Energy for Winter Diet"
    ],
    "nutrition": {
      "calories": "361 kcal/100g",
      "protein": "11.6g",
      "carbs": "67g",
      "fats": "5.0g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Crop": "Kharif Harvest",
      "Shelf Life": "9 Months"
    },
    "shelf_life": "9 Months",
    "images": [
      "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 45,
    "original_price": 55,
    "discount": 18,
    "unit": "kg",
    "stock_qty": 180,
    "is_organic": true,
    "is_seasonal": true,
    "is_featured": false,
    "badges": [
      "Desi Bajra"
    ],
    "tags": [
      "bajra",
      "millet",
      "grains",
      "haryana"
    ],
    "rating_avg": 4.84,
    "rating_count": 58,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-gr-5",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Karnataka",
    "title": "Karnataka Nutrient-Rich Red Ragi (Finger Millet)",
    "slug": "karnataka-nutrient-rich-red-ragi-finger-millet",
    "category_id": "cat-grains",
    "category_name": "Grains & Cereals",
    "subcategory": "Millets",
    "description": "Calcium powerhouse finger millet, essential for healthy bone density, infant porridge, and wholesome dosas.",
    "benefits": [
      "344mg Calcium per 100g",
      "High Amino Acid Content",
      "Low Glycemic Index"
    ],
    "nutrition": {
      "calories": "328 kcal/100g",
      "protein": "7.3g",
      "carbs": "72g",
      "fats": "1.3g"
    },
    "specifications": {
      "Origin": "Karnataka",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 55,
    "original_price": 68,
    "discount": 19,
    "unit": "kg",
    "stock_qty": 120,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "High Calcium Superfood"
    ],
    "tags": [
      "ragi",
      "millet",
      "grains"
    ],
    "rating_avg": 4.89,
    "rating_count": 72,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-gr-6",
    "farmer_id": "f-6",
    "farmer_name": "Baldev Singh Dhillon",
    "farm_name": "Karnal Basmati Heritage Farms",
    "farmer_location": "Karnal, Haryana",
    "title": "Whole Grain Organic Brown Rice",
    "slug": "whole-grain-organic-brown-rice",
    "category_id": "cat-grains",
    "category_name": "Grains & Cereals",
    "subcategory": "Rice",
    "description": "Unpolished brown basmati rice retaining natural outer bran layer, rich in magnesium, selenium, and dietary fiber.",
    "benefits": [
      "Low GI Complex Carbohydrates",
      "Unpolished Outer Bran Intact",
      "Rich in Selenium & Magnesium"
    ],
    "nutrition": {
      "calories": "355 kcal/100g",
      "protein": "7.9g",
      "carbs": "77g",
      "fats": "2.9g"
    },
    "specifications": {
      "Origin": "Karnal, Haryana",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 120,
    "original_price": 150,
    "discount": 20,
    "unit": "kg",
    "stock_qty": 140,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Unpolished Bran"
    ],
    "tags": [
      "brownrice",
      "rice",
      "grains"
    ],
    "rating_avg": 4.8,
    "rating_count": 49,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-pu-1",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Latur, Maharashtra",
    "title": "Unpolished Organic Toor Dal (Arhar)",
    "slug": "unpolished-organic-toor-dal-arhar",
    "category_id": "cat-pulses",
    "category_name": "Pulses & Legumes",
    "subcategory": "Dals",
    "description": "Sun-dried pigeon pea split dal with zero chemical polish, marble powder, or synthetic oil treatment. Cooks creamy.",
    "benefits": [
      "Zero Chemical Polish or Color",
      "22% Plant Protein",
      "Rich Natural Dal Aroma"
    ],
    "nutrition": {
      "calories": "343 kcal/100g",
      "protein": "22.3g",
      "carbs": "62g",
      "fats": "1.5g"
    },
    "specifications": {
      "Origin": "Latur, Maharashtra",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 165,
    "original_price": 195,
    "discount": 15,
    "unit": "kg",
    "stock_qty": 190,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Unpolished Dal",
      "High Protein"
    ],
    "tags": [
      "toordal",
      "arhar",
      "pulses"
    ],
    "rating_avg": 4.92,
    "rating_count": 115,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-pu-2",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Rajasthan",
    "title": "Unpolished Yellow Split Moong Dal",
    "slug": "unpolished-yellow-split-moong-dal",
    "category_id": "cat-pulses",
    "category_name": "Pulses & Legumes",
    "subcategory": "Dals",
    "description": "Light on digestion, quick-cooking yellow split moong beans, ideal for light khichdi and daily protein bowls.",
    "benefits": [
      "Easiest Dal to Digest",
      "High Folate & Potassium",
      "Unpolished Raw Processing"
    ],
    "nutrition": {
      "calories": "347 kcal/100g",
      "protein": "24.0g",
      "carbs": "63g",
      "fats": "1.2g"
    },
    "specifications": {
      "Origin": "Rajasthan",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 135,
    "original_price": 160,
    "discount": 16,
    "unit": "kg",
    "stock_qty": 160,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Easy Digest"
    ],
    "tags": [
      "moong",
      "dal",
      "pulses"
    ],
    "rating_avg": 4.85,
    "rating_count": 78,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-pu-3",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Jammu & Kashmir",
    "title": "Authentic Kashmiri Red Rajma (Kidney Beans)",
    "slug": "authentic-kashmiri-red-rajma-kidney-beans",
    "category_id": "cat-pulses",
    "category_name": "Pulses & Legumes",
    "subcategory": "Beans",
    "description": "Small-grained, blood-red kidney beans from mountain slopes of Bhaderwah, J&K. Melts in mouth with velvety gravy.",
    "benefits": [
      "Bhaderwah Kashmiri Origin",
      "Cooks Tender & Velvety",
      "No Artificial Coloring"
    ],
    "nutrition": {
      "calories": "333 kcal/100g",
      "protein": "24.0g",
      "carbs": "60g",
      "fats": "0.8g"
    },
    "specifications": {
      "Origin": "Bhaderwah, J&K",
      "Shelf Life": "18 Months"
    },
    "shelf_life": "18 Months",
    "images": [
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 180,
    "original_price": 220,
    "discount": 18,
    "unit": "kg",
    "stock_qty": 110,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Kashmiri Bhaderwah"
    ],
    "tags": [
      "rajma",
      "kashmir",
      "beans",
      "pulses"
    ],
    "rating_avg": 4.96,
    "rating_count": 130,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-pu-4",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Haryana",
    "title": "Desi Brown Kala Chana (Bengal Gram)",
    "slug": "desi-brown-kala-chana-bengal-gram",
    "category_id": "cat-pulses",
    "category_name": "Pulses & Legumes",
    "subcategory": "Chickpeas",
    "description": "Small-sized, nutrient-dense brown chickpeas ideal for sprouting, morning fitness snacks, and traditional curry.",
    "benefits": [
      "Superfood for Sprouting",
      "High Soluble Fiber",
      "Sustained Energy Release"
    ],
    "nutrition": {
      "calories": "360 kcal/100g",
      "protein": "20.5g",
      "carbs": "60g",
      "fats": "5.3g"
    },
    "specifications": {
      "Origin": "Haryana",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 85,
    "original_price": 105,
    "discount": 19,
    "unit": "kg",
    "stock_qty": 140,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Desi Chana"
    ],
    "tags": [
      "chana",
      "kalachana",
      "pulses"
    ],
    "rating_avg": 4.82,
    "rating_count": 65,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-dy-1",
    "farmer_id": "f-4",
    "farmer_name": "Devendra Joshi",
    "farm_name": "Gir Gaushala Naturals",
    "farmer_location": "Junagadh, Gujarat",
    "title": "Pure Hand-Churned Bilona A2 Desi Cow Ghee",
    "slug": "pure-hand-churned-bilona-a2-desi-cow-ghee",
    "category_id": "cat-dairy",
    "category_name": "Dairy & Milk Products",
    "subcategory": "Traditional Dairy",
    "description": "Prepared from fermented whole curd of indigenous free-grazing Gir cows using traditional wooden bilona churning. Golden, aromatic, and rich in butyric acid.",
    "benefits": [
      "Traditional Vedic Bilona Method",
      "100% Pure Gir Cow A2 Milk",
      "Danedar Golden Texture",
      "Rich in Fat-Soluble Vitamins A, D, E, K"
    ],
    "nutrition": {
      "calories": "897 kcal/100g",
      "protein": "0g",
      "carbs": "0g",
      "fats": "99.7g"
    },
    "specifications": {
      "Origin": "Gir Forest, Gujarat",
      "Process": "Clay Pot Bi-directional Churning",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 950,
    "original_price": 1200,
    "discount": 21,
    "unit": "1kg jar",
    "stock_qty": 60,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "A2 Bilona",
      "Vedic Churned"
    ],
    "tags": [
      "ghee",
      "a2ghee",
      "dairy",
      "organic"
    ],
    "rating_avg": 4.98,
    "rating_count": 160,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-dy-2",
    "farmer_id": "f-6",
    "farmer_name": "Baldev Singh Dhillon",
    "farm_name": "Karnal Basmati Heritage Farms",
    "farmer_location": "Karnal, Haryana",
    "title": "Farm Fresh Pure Cow Milk",
    "slug": "farm-fresh-pure-cow-milk",
    "category_id": "cat-dairy",
    "category_name": "Dairy & Milk Products",
    "subcategory": "Milk",
    "description": "Freshly milked raw cow milk from well-tended cows fed on fresh green fodder and mustard cake in Karnal. Zero adulteration.",
    "benefits": [
      "Raw Unprocessed Purity",
      "Delivered within 4 Hours of Milking",
      "Zero Preservatives"
    ],
    "nutrition": {
      "calories": "62 kcal/100ml",
      "protein": "3.2g",
      "carbs": "4.8g",
      "fats": "3.6g"
    },
    "specifications": {
      "Origin": "Karnal, Haryana",
      "Packaging": "Glass Bottle",
      "Shelf Life": "2 Days (Chilled)"
    },
    "shelf_life": "2 Days (Chilled)",
    "images": [
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 65,
    "original_price": 75,
    "discount": 13,
    "unit": "litre",
    "stock_qty": 80,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Karnal Dairy Fresh"
    ],
    "tags": [
      "milk",
      "cowmilk",
      "dairy"
    ],
    "rating_avg": 4.92,
    "rating_count": 105,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-dy-3",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Rich Creamy Desi Buffalo Milk",
    "slug": "rich-creamy-desi-buffalo-milk",
    "category_id": "cat-dairy",
    "category_name": "Dairy & Milk Products",
    "subcategory": "Milk",
    "description": "Thick, high-fat buffalo milk from Murrah buffaloes of Haryana. Yields rich malai and thick curd.",
    "benefits": [
      "7.5%+ Natural Milk Fat",
      "Rich in Calcium & Casein",
      "Ideal for Thick Kheer & Malai"
    ],
    "nutrition": {
      "calories": "97 kcal/100ml",
      "protein": "3.8g",
      "carbs": "5.2g",
      "fats": "7.5g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Breed": "Murrah Buffalo",
      "Shelf Life": "2 Days (Chilled)"
    },
    "shelf_life": "2 Days (Chilled)",
    "images": [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 75,
    "original_price": 85,
    "discount": 12,
    "unit": "litre",
    "stock_qty": 70,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Murrah Buffalo",
      "Haryana Special"
    ],
    "tags": [
      "milk",
      "buffalomilk",
      "dairy"
    ],
    "rating_avg": 4.88,
    "rating_count": 90,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-dy-4",
    "farmer_id": "f-6",
    "farmer_name": "Baldev Singh Dhillon",
    "farm_name": "Karnal Basmati Heritage Farms",
    "farmer_location": "Karnal, Haryana",
    "title": "Fresh Soft Malai Paneer",
    "slug": "fresh-soft-malai-paneer",
    "category_id": "cat-dairy",
    "category_name": "Dairy & Milk Products",
    "subcategory": "Traditional Dairy",
    "description": "Crafted fresh every morning from whole cow milk curdled with natural lemon. Soft, velvety, and high in protein.",
    "benefits": [
      "Zero Starch or Synthetic Fat",
      "Soft & Melt-in-Mouth",
      "18g Protein per 100g"
    ],
    "nutrition": {
      "calories": "265 kcal/100g",
      "protein": "18.3g",
      "carbs": "1.2g",
      "fats": "20.8g"
    },
    "specifications": {
      "Origin": "Karnal, Haryana",
      "Shelf Life": "4 Days (Chilled)"
    },
    "shelf_life": "4 Days (Chilled)",
    "images": [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 120,
    "original_price": 140,
    "discount": 14,
    "unit": "250g",
    "stock_qty": 90,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Fresh Malai Paneer"
    ],
    "tags": [
      "paneer",
      "dairy"
    ],
    "rating_avg": 4.94,
    "rating_count": 98,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-sp-1",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Pampore, Kashmir",
    "title": "Pure Kashmiri Mongra Saffron (Grade A1 Kesar)",
    "slug": "pure-kashmiri-mongra-saffron-grade-a1-kesar",
    "category_id": "cat-spices",
    "category_name": "Spices & Condiments",
    "subcategory": "Premium Spices",
    "description": "100% authentic GI-tagged Pampore Mongra saffron stigmas. Deep crimson threads with high natural crocin delivering exquisite aroma and royal color.",
    "benefits": [
      "100% Hand-Harvested Mongra Stigmas",
      "GI Protected Pampore Kashmir Heritage",
      "High Crocin & Safranal Content"
    ],
    "nutrition": {
      "calories": "310 kcal/100g",
      "protein": "11.4g",
      "carbs": "65.4g",
      "fats": "5.8g"
    },
    "specifications": {
      "Origin": "Pampore, Kashmir",
      "Grade": "Mongra Grade A1",
      "Shelf Life": "36 Months"
    },
    "shelf_life": "36 Months",
    "images": [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 490,
    "original_price": 620,
    "discount": 21,
    "unit": "1g box",
    "stock_qty": 150,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "GI Tagged",
      "Pure Mongra"
    ],
    "tags": [
      "saffron",
      "kesar",
      "kashmir",
      "spices"
    ],
    "rating_avg": 5.0,
    "rating_count": 240,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-sp-2",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Meghalaya",
    "title": "Pure Meghalaya Lakadong Haldi (Turmeric Powder)",
    "slug": "pure-meghalaya-lakadong-haldi-turmeric-powder",
    "category_id": "cat-spices",
    "category_name": "Spices & Condiments",
    "subcategory": "Organic Spices",
    "description": "World-renowned Lakadong turmeric containing extraordinary 7% to 9% natural curcumin. Earthy fragrance and deep golden orange color.",
    "benefits": [
      "7%+ Natural Curcumin Level",
      "Zero Lead Chromate or Fillers",
      "Unmatched Medicinal Anti-Inflammatory Value"
    ],
    "nutrition": {
      "calories": "354 kcal/100g",
      "protein": "7.8g",
      "carbs": "65g",
      "fats": "9.9g"
    },
    "specifications": {
      "Origin": "Jaintia Hills, Meghalaya",
      "Curcumin": "7.8%",
      "Shelf Life": "18 Months"
    },
    "shelf_life": "18 Months",
    "images": [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 120,
    "original_price": 150,
    "discount": 20,
    "unit": "250g",
    "stock_qty": 120,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "7%+ Curcumin",
      "Lakadong"
    ],
    "tags": [
      "turmeric",
      "haldi",
      "spices"
    ],
    "rating_avg": 4.95,
    "rating_count": 135,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-sp-3",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Wayanad, Kerala",
    "title": "Malabar Tellicherry Black Pepper (Kali Mirch)",
    "slug": "malabar-tellicherry-black-pepper-kali-mirch",
    "category_id": "cat-spices",
    "category_name": "Spices & Condiments",
    "subcategory": "Whole Spices",
    "description": "Sun-ripened bold black peppercorns from Malabar Coast with intense biting heat and complex woody aroma.",
    "benefits": [
      "TGSEB Bold Grade Berries",
      "High Piperine Heat",
      "Sun-Dried Naturally"
    ],
    "nutrition": {
      "calories": "251 kcal/100g",
      "protein": "10.4g",
      "carbs": "64g",
      "fats": "3.3g"
    },
    "specifications": {
      "Origin": "Wayanad, Kerala",
      "Shelf Life": "24 Months"
    },
    "shelf_life": "24 Months",
    "images": [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 140,
    "original_price": 175,
    "discount": 20,
    "unit": "100g",
    "stock_qty": 100,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Tellicherry Bold"
    ],
    "tags": [
      "blackpepper",
      "kalimirch",
      "spices"
    ],
    "rating_avg": 4.88,
    "rating_count": 82,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-oil-1",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Cold-Pressed Kachi Ghani Mustard Oil (Sarson Tel)",
    "slug": "cold-pressed-kachi-ghani-mustard-oil-sarson-tel",
    "category_id": "cat-oils",
    "category_name": "Oilseeds & Edible Oils",
    "subcategory": "Edible Oils",
    "description": "Extracted at low temperature from black mustard seeds in traditional wooden Kohlu. Unrefined, pungent aroma, rich in Omega-3.",
    "benefits": [
      "Cold Pressed in Wooden Kohlu",
      "Natural Pungency & High Smoke Point",
      "Unrefined & Chemical-Free"
    ],
    "nutrition": {
      "calories": "884 kcal/100ml",
      "protein": "0g",
      "carbs": "0g",
      "fats": "100g"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Process": "Wood Pressed Cold Ghani",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 185,
    "original_price": 230,
    "discount": 20,
    "unit": "1 litre",
    "stock_qty": 130,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Kachi Ghani",
      "Wooden Cold Pressed"
    ],
    "tags": [
      "mustardoil",
      "sarson",
      "oils",
      "haryana"
    ],
    "rating_avg": 4.92,
    "rating_count": 118,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-oil-2",
    "farmer_id": "f-4",
    "farmer_name": "Devendra Joshi",
    "farm_name": "Gir Gaushala Naturals",
    "farmer_location": "Saurashtra, Gujarat",
    "title": "Wood-Pressed Groundnut Oil (Peanut Oil)",
    "slug": "wood-pressed-groundnut-oil-peanut-oil",
    "category_id": "cat-oils",
    "category_name": "Oilseeds & Edible Oils",
    "subcategory": "Edible Oils",
    "description": "Unrefined golden groundnut oil made from Saurashtra bold peanuts. Sweet nutty aroma, heart-friendly MUFA fats.",
    "benefits": [
      "Cold Wood-Pressed Extraction",
      "Heart Healthy MUFA Rich",
      "Zero Solvent Extraction"
    ],
    "nutrition": {
      "calories": "884 kcal/100ml",
      "protein": "0g",
      "carbs": "0g",
      "fats": "100g"
    },
    "specifications": {
      "Origin": "Saurashtra, Gujarat",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 220,
    "original_price": 270,
    "discount": 19,
    "unit": "1 litre",
    "stock_qty": 90,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Wood Pressed"
    ],
    "tags": [
      "groundnutoil",
      "peanutoil",
      "oils"
    ],
    "rating_avg": 4.86,
    "rating_count": 75,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-df-1",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Kashmir",
    "title": "Kashmiri Giri Mamra Almonds (Badam)",
    "slug": "kashmiri-giri-mamra-almonds-badam",
    "category_id": "cat-dry-fruits",
    "category_name": "Dry Fruits & Nuts",
    "subcategory": "Nuts",
    "description": "Concave shaped authentic Kashmiri Mamra almonds containing over 50% natural almond oil. Unpasteurized and non-GMO.",
    "benefits": [
      "50%+ Natural Almond Oil",
      "Unpasteurized Pure Giri",
      "Enhances Memory & Brain Energy"
    ],
    "nutrition": {
      "calories": "579 kcal/100g",
      "protein": "21.2g",
      "carbs": "21.6g",
      "fats": "49.9g"
    },
    "specifications": {
      "Origin": "Kashmir Valley",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 450,
    "original_price": 550,
    "discount": 18,
    "unit": "250g",
    "stock_qty": 80,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Kashmiri Mamra"
    ],
    "tags": [
      "almonds",
      "badam",
      "dryfruits"
    ],
    "rating_avg": 4.96,
    "rating_count": 125,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-df-2",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Kashmir",
    "title": "Kashmiri Snow-White Akhrot Giri (Walnuts)",
    "slug": "kashmiri-snow-white-akhrot-giri-walnuts",
    "category_id": "cat-dry-fruits",
    "category_name": "Dry Fruits & Nuts",
    "subcategory": "Nuts",
    "description": "Fresh, light-amber walnut halves from organic orchards of Kashmir. Supreme source of plant-based Omega-3 ALA.",
    "benefits": [
      "High Plant Omega-3 (ALA)",
      "Zero Bitter Aftertaste",
      "Hand-Cracked Halves"
    ],
    "nutrition": {
      "calories": "654 kcal/100g",
      "protein": "15.2g",
      "carbs": "13.7g",
      "fats": "65.2g"
    },
    "specifications": {
      "Origin": "Kashmir Valley",
      "Shelf Life": "9 Months"
    },
    "shelf_life": "9 Months",
    "images": [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 380,
    "original_price": 475,
    "discount": 20,
    "unit": "250g",
    "stock_qty": 95,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Kashmir Walnuts"
    ],
    "tags": [
      "walnut",
      "akhrot",
      "dryfruits"
    ],
    "rating_avg": 4.91,
    "rating_count": 88,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-df-3",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Bihar",
    "title": "Bihar Jumbo Phool Makhana (Fox Nuts)",
    "slug": "bihar-jumbo-phool-makhana-fox-nuts",
    "category_id": "cat-dry-fruits",
    "category_name": "Dry Fruits & Nuts",
    "subcategory": "Dry Fruits",
    "description": "Super crispy 6-suta grade fox nuts hand-popped from fresh lotus seed ponds in Darbhanga, Bihar.",
    "benefits": [
      "Low Calorie High Protein Snack",
      "Gluten-Free & Rich in Magnesium",
      "GI Protected Mithila Region"
    ],
    "nutrition": {
      "calories": "347 kcal/100g",
      "protein": "9.7g",
      "carbs": "76g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Mithila, Bihar",
      "Grade": "6 Suta Hand-Popped",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 220,
    "original_price": 280,
    "discount": 21,
    "unit": "250g",
    "stock_qty": 110,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Mithila Makhana"
    ],
    "tags": [
      "makhana",
      "foxnuts",
      "dryfruits"
    ],
    "rating_avg": 4.88,
    "rating_count": 92,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-sd-1",
    "farmer_id": "f-6",
    "farmer_name": "Baldev Singh Dhillon",
    "farm_name": "Karnal Basmati Heritage Farms",
    "farmer_location": "Karnal, Haryana",
    "title": "Certified Sharbati Wheat Seeds (HD-2967)",
    "slug": "certified-sharbati-wheat-seeds-hd-2967",
    "category_id": "cat-seeds",
    "category_name": "Seeds",
    "subcategory": "Crop Seeds",
    "description": "Certified breeder seed stock of HD-2967 with 98%+ germination rate and high resistance to yellow rust.",
    "benefits": [
      "98%+ Certified Germination",
      "Yellow Rust Disease Resistant",
      "Government Certified Breeder Quality"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Origin": "Karnal, Haryana",
      "Germination": "98%",
      "Shelf Life": "18 Months"
    },
    "shelf_life": "18 Months",
    "images": [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 450,
    "original_price": 520,
    "discount": 13,
    "unit": "10kg bag",
    "stock_qty": 100,
    "is_organic": false,
    "is_seasonal": true,
    "is_featured": true,
    "badges": [
      "Certified Seeds",
      "HD-2967"
    ],
    "tags": [
      "seeds",
      "wheatseeds",
      "haryana"
    ],
    "rating_avg": 4.9,
    "rating_count": 64,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-sd-2",
    "farmer_id": "f-1",
    "farmer_name": "Rajesh Patel",
    "farm_name": "Patel Organic Farms",
    "farmer_location": "Maharashtra",
    "title": "F1 Hybrid Abhinav Tomato Seeds",
    "slug": "f1-hybrid-abhinav-tomato-seeds",
    "category_id": "cat-seeds",
    "category_name": "Seeds",
    "subcategory": "Vegetable Seeds",
    "description": "High-yielding determinate tomato seeds producing uniform firm fruits with excellent transport tolerance.",
    "benefits": [
      "High Disease Resistance (TLCV)",
      "Firm Red Fruit Output",
      "Ideal for All Seasons"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Origin": "Maharashtra",
      "Seeds Count": "~3500 seeds",
      "Shelf Life": "24 Months"
    },
    "shelf_life": "24 Months",
    "images": [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 220,
    "original_price": 260,
    "discount": 15,
    "unit": "10g pkt",
    "stock_qty": 80,
    "is_organic": false,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "F1 Hybrid"
    ],
    "tags": [
      "seeds",
      "tomatoseeds"
    ],
    "rating_avg": 4.82,
    "rating_count": 38,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-ft-1",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "100% Pure Earthworm Vermicompost (Kechua Khaad)",
    "slug": "100-pure-earthworm-vermicompost-kechua-khaad",
    "category_id": "cat-fertilizers",
    "category_name": "Fertilizers & Manure",
    "subcategory": "Organic Fertilizers",
    "description": "Nutrient-packed organic black gold created by Australian red worms (Eisenia Fetida) feeding on cow dung and neem leaves. Restores soil biology.",
    "benefits": [
      "Rich in Beneficial Microbes & Enzymes",
      "Enhances Soil Moisture Holding by 40%",
      "Zero Weed Seeds or Odor"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Moisture": "20-25%",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 240,
    "original_price": 300,
    "discount": 20,
    "unit": "25kg bag",
    "stock_qty": 200,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "100% Organic",
      "Soil Healer"
    ],
    "tags": [
      "vermicompost",
      "fertilizer",
      "organic",
      "haryana"
    ],
    "rating_avg": 4.95,
    "rating_count": 120,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-ft-2",
    "farmer_id": "f-4",
    "farmer_name": "Devendra Joshi",
    "farm_name": "Gir Gaushala Naturals",
    "farmer_location": "Gujarat",
    "title": "Cold-Pressed Organic Neem Cake Fertilizer",
    "slug": "cold-pressed-organic-neem-cake-fertilizer",
    "category_id": "cat-fertilizers",
    "category_name": "Fertilizers & Manure",
    "subcategory": "Organic Fertilizers",
    "description": "Natural soil bio-fertilizer and nematicide that protects plant roots against termites and root grubs while releasing nitrogen.",
    "benefits": [
      "Protects Roots from Termites & Nematodes",
      "Slow Release Natural Nitrogen",
      "Organic NPOP Certified"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Origin": "Gujarat",
      "NPK Ratio": "5:1:2",
      "Shelf Life": "18 Months"
    },
    "shelf_life": "18 Months",
    "images": [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 320,
    "original_price": 390,
    "discount": 18,
    "unit": "10kg bag",
    "stock_qty": 120,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Neem Cake"
    ],
    "tags": [
      "fertilizer",
      "neem",
      "organic"
    ],
    "rating_avg": 4.88,
    "rating_count": 71,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-eq-1",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Punjab",
    "title": "Heavy Duty Forged Steel Spade (Phawra / Kudal)",
    "slug": "heavy-duty-forged-steel-spade-phawra-kudal",
    "category_id": "cat-equipment",
    "category_name": "Agricultural Tools & Equipment",
    "subcategory": "Hand Tools",
    "description": "Forged high-carbon steel spade blade with seasoned hardwood handle for deep furrowing, soil preparation, and irrigation trenches.",
    "benefits": [
      "Forged High-Carbon Steel",
      "Seasoned Hardwood Handle",
      "Rust-Resistant Black Coating"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Weight": "2.4 kg",
      "Material": "High-Carbon Steel",
      "Warranty": "2 Years"
    },
    "shelf_life": "Lifetime Tool",
    "images": [
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 450,
    "original_price": 550,
    "discount": 18,
    "unit": "piece",
    "stock_qty": 60,
    "is_organic": false,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Forged Steel",
      "Heavy Duty"
    ],
    "tags": [
      "tools",
      "spade",
      "equipment"
    ],
    "rating_avg": 4.86,
    "rating_count": 52,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-eq-2",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Haryana",
    "title": "16-Litre Manual Knapsack Agriculture Sprayer",
    "slug": "16-litre-manual-knapsack-agriculture-sprayer",
    "category_id": "cat-equipment",
    "category_name": "Agricultural Tools & Equipment",
    "subcategory": "Sprayers",
    "description": "Ergonomic backpack chemical-resistant sprayer with brass lance and triple nozzle set for uniform foliar crop spraying.",
    "benefits": [
      "16 Litre UV-Protected Tank",
      "Durable Brass Lance & Nozzles",
      "Smooth Pressure Chamber"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Capacity": "16 Litres",
      "Pressure": "0.2 - 0.4 Mpa",
      "Warranty": "1 Year"
    },
    "shelf_life": "Durable",
    "images": [
      "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 1150,
    "original_price": 1400,
    "discount": 18,
    "unit": "piece",
    "stock_qty": 45,
    "is_organic": false,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Agro Sprayer"
    ],
    "tags": [
      "sprayer",
      "equipment"
    ],
    "rating_avg": 4.79,
    "rating_count": 44,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-pl-1",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Haryana",
    "title": "Sacred Rama Tulsi Medicinal Plant in Pot",
    "slug": "sacred-rama-tulsi-medicinal-plant-in-pot",
    "category_id": "cat-plants",
    "category_name": "Flowers & Plants",
    "subcategory": "Medicinal Plants",
    "description": "Authentic Rama Tulsi sapling grown in vermicompost blend. Revered for daily herbal tea, respiratory support, and home positive energy.",
    "benefits": [
      "Ayurvedic Adaptogen Herb",
      "Repels Mosquitoes Naturally",
      "Rooted in Organic Soil Pot"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Plant Height": "10-12 inches",
      "Pot Size": "6 inch pot",
      "Care": "Daily sunlight"
    },
    "shelf_life": "Live Plant",
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 65,
    "original_price": 85,
    "discount": 24,
    "unit": "plant",
    "stock_qty": 100,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Sacred Tulsi"
    ],
    "tags": [
      "tulsi",
      "plants",
      "ayurveda"
    ],
    "rating_avg": 4.95,
    "rating_count": 96,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-pl-2",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Haryana",
    "title": "Fragrant Red Desi Rose (Gulab) Bush",
    "slug": "fragrant-red-desi-rose-gulab-bush",
    "category_id": "cat-plants",
    "category_name": "Flowers & Plants",
    "subcategory": "Flowering Plants",
    "description": "Ever-blooming Indian country rose plant known for intoxicating sweet scent, gulkand making, and pure rose water distillation.",
    "benefits": [
      "Intense Natural Sweet Fragrance",
      "Continuous Flowering",
      "Hardy Indian Rootstock"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "N/A",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Plant Height": "12-14 inches",
      "Pot Size": "7 inch nursery bag"
    },
    "shelf_life": "Live Plant",
    "images": [
      "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 95,
    "original_price": 120,
    "discount": 21,
    "unit": "plant",
    "stock_qty": 80,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Desi Gulab"
    ],
    "tags": [
      "rose",
      "flowers",
      "plants"
    ],
    "rating_avg": 4.88,
    "rating_count": 54,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-ot-1",
    "farmer_id": "f-2",
    "farmer_name": "Abdul Rashid Mir",
    "farm_name": "Kashmir Valley Organics",
    "farmer_location": "Himalayas, Uttarakhand",
    "title": "100% Raw Wild Forest Multi-Flora Honey",
    "slug": "100-raw-wild-forest-multi-flora-honey",
    "category_id": "cat-other",
    "category_name": "Other Agricultural Products",
    "subcategory": "Honey & Sweeteners",
    "description": "Unpasteurized, unprocessed raw honey collected by tribal beekeepers from mountain flora. Retains active bee pollen and enzymes.",
    "benefits": [
      "Unpasteurized & Cold-Extracted",
      "Contains Active Bee Pollen",
      "Zero Added Sugar Syrup or Adulteration"
    ],
    "nutrition": {
      "calories": "304 kcal/100g",
      "protein": "0.3g",
      "carbs": "82.4g",
      "fats": "0g"
    },
    "specifications": {
      "Origin": "Garhwal Himalayas",
      "Shelf Life": "24 Months"
    },
    "shelf_life": "24 Months",
    "images": [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 380,
    "original_price": 475,
    "discount": 20,
    "unit": "500g jar",
    "stock_qty": 85,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Wild Forest Honey"
    ],
    "tags": [
      "honey",
      "rawhoney",
      "organic"
    ],
    "rating_avg": 4.97,
    "rating_count": 142,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-ot-2",
    "farmer_id": "f-3",
    "farmer_name": "Gurpreet Singh",
    "farm_name": "Punjab Bio Fields",
    "farmer_location": "Muzaffarnagar, UP",
    "title": "Organic Chemical-Free Desi Gur (Jaggery Cubes)",
    "slug": "organic-chemical-free-desi-gur-jaggery-cubes",
    "category_id": "cat-other",
    "category_name": "Other Agricultural Products",
    "subcategory": "Honey & Sweeteners",
    "description": "Made by boiling fresh organic sugarcane juice with wild ladyfinger bark extract as natural clarifier. Zero sodium hydrosulphite.",
    "benefits": [
      "Zero Chemical Bleach",
      "Natural Iron & Mineral Rich",
      "Purifies Blood & Aids Digestion"
    ],
    "nutrition": {
      "calories": "383 kcal/100g",
      "protein": "0.4g",
      "carbs": "98g",
      "fats": "0.1g"
    },
    "specifications": {
      "Origin": "Muzaffarnagar, UP",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 75,
    "original_price": 95,
    "discount": 21,
    "unit": "1kg",
    "stock_qty": 150,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": true,
    "badges": [
      "Desi Gur"
    ],
    "tags": [
      "jaggery",
      "gur",
      "natural"
    ],
    "rating_avg": 4.92,
    "rating_count": 108,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  },
  {
    "id": "p-ot-3",
    "farmer_id": "f-5",
    "farmer_name": "Suresh Verma",
    "farm_name": "Panipat Kisan Bio-Farms",
    "farmer_location": "Panipat, Haryana",
    "title": "Clean Wheat Straw / Turi Animal Feed Fodder",
    "slug": "clean-wheat-straw-turi-animal-feed-fodder",
    "category_id": "cat-other",
    "category_name": "Other Agricultural Products",
    "subcategory": "Animal Feed & Fodder",
    "description": "Dry machine-cut golden wheat straw (Turi) from Haryana fields. Clean, dust-filtered, and highly nutritious dry fodder for dairy cattle.",
    "benefits": [
      "Dust-Free Screened Straw",
      "Essential Roughage for Ruminants",
      "Direct from Panipat Mandi"
    ],
    "nutrition": {
      "calories": "N/A",
      "protein": "4.2%",
      "carbs": "N/A",
      "fats": "N/A"
    },
    "specifications": {
      "Origin": "Panipat, Haryana",
      "Moisture": "<12%",
      "Shelf Life": "12 Months"
    },
    "shelf_life": "12 Months",
    "images": [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800"
    ],
    "price": 450,
    "original_price": 550,
    "discount": 18,
    "unit": "quintal",
    "stock_qty": 60,
    "is_organic": true,
    "is_seasonal": false,
    "is_featured": false,
    "badges": [
      "Panipat Mandi",
      "Dry Fodder"
    ],
    "tags": [
      "fodder",
      "turi",
      "cattlefeed",
      "haryana"
    ],
    "rating_avg": 4.85,
    "rating_count": 34,
    "status": "active",
    "created_at": "2026-03-01T10:00:00Z"
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'AGRO-2026-1001',
    user_id: 'c-1',
    items: [
      {
        product_id: 'p-vg-1',
        title: 'Farm Fresh Organic Tomatoes (Desi Tamatar)',
        price: 45,
        qty: 2,
        unit: 'kg',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      },
      {
        product_id: 'p-dy-2',
        title: 'Traditional Vedic Bilona A2 Desi Gir Cow Ghee',
        price: 1450,
        qty: 1,
        unit: '500ml',
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
        product_id: 'p-sp-1',
        title: 'Pure Kashmiri Mongra Saffron (Grade A1 Kesar)',
        price: 490,
        qty: 1,
        unit: '1g box',
        image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
      },
      {
        product_id: 'p-fr-2',
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
    gst: 42,
    delivery_fee: 40,
    discount: 0,
    total: 932,
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
  wishlist: Record<string, string[]>;
  addresses: Record<string, Address[]>;
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
      'c-1': ['p-sp-1', 'p-dy-2', 'p-fr-1'],
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
    subcategory?: string;
    location?: string;
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
      if (slug === 'organic') {
        res = res.filter((p) => p.is_organic);
      } else if (slug === 'other-agriculture' || slug === 'organic-farming') {
        res = res.filter((p) => p.category_id === 'cat-other');
      } else if (slug === 'seeds-grains' || slug === 'grains-seeds') {
        res = res.filter((p) => p.category_id === 'cat-grains' || p.category_id === 'cat-seeds');
      } else {
        const cat = state.categories.find((c) => c.slug === slug || c.id === slug);
        if (cat) {
          res = res.filter((p) => p.category_id === cat.id);
        } else {
          res = res.filter(
            (p) =>
              p.category_name?.toLowerCase().includes(slug) ||
              p.subcategory?.toLowerCase().includes(slug)
          );
        }
      }
    }

    if (filters?.subcategory) {
      const sub = filters.subcategory.toLowerCase();
      res = res.filter((p) => p.subcategory?.toLowerCase() === sub);
    }

    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      res = res.filter((p) => p.farmer_location?.toLowerCase().includes(loc));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      res = res.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.farmer_name?.toLowerCase().includes(q) ||
          p.farmer_location?.toLowerCase().includes(q) ||
          p.farm_name?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
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

