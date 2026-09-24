import { describe, it, expect, beforeEach } from 'vitest';
import { dataService } from './dataService';

describe('AgroMart dataService Integration & Reactive Logic', () => {
  beforeEach(() => {
    // Reset data before each test
    dataService.resetDemoData();
  });

  it('provides all 7 agricultural categories with initial products', () => {
    const categories = dataService.getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(7);
    const slugs = categories.map((c) => c.slug);
    expect(slugs).toContain('vegetables');
    expect(slugs).toContain('fruits');
    expect(slugs).toContain('grains');
    expect(slugs).toContain('seeds');
    expect(slugs).toContain('dairy');
    expect(slugs).toContain('spices');
  });

  it('ensures all products have realistic images, pricing, unit, and farmer details', () => {
    const products = dataService.getProducts();
    expect(products.length).toBeGreaterThanOrEqual(15);

    for (const product of products) {
      expect(product.title).toBeTruthy();
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.images[0]).toContain('https://images.unsplash.com');
      expect(product.price).toBeGreaterThan(0);
      expect(product.unit).toBeTruthy();
      expect(product.stock_qty).toBeGreaterThanOrEqual(0);
      expect(product.farm_name).toBeTruthy();
      expect(product.farmer_id).toBeTruthy();
    }
  });

  it('deducts product stock and propagates new orders across Customer, Farmer, and Admin', () => {
    const products = dataService.getProducts();
    const product = products[0];
    const initialStock = product.stock_qty;
    const orderQty = 3;

    // 1. Customer places order
    const order = dataService.createOrder({
      user_id: 'c-1',
      items: [
        {
          product_id: product.id,
          title: product.title,
          qty: orderQty,
          price: product.price,
          unit: product.unit,
          image: product.images[0],
        },
      ],
      address: {
        label: 'Home',
        line1: 'B-402, Green Meadows',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411045',
      },
      payment_method: 'cod',
      subtotal: product.price * orderQty,
      total: product.price * orderQty,
    });

    expect(order.id).toBeTruthy();
    expect(order.order_status).toBe('placed');

    // 2. Verify stock reduction
    const updatedProduct = dataService.getProductBySlugOrId(product.id);
    expect(updatedProduct?.stock_qty).toBe(initialStock - orderQty);

    // 3. Customer sees order in Customer orders
    const customerOrders = dataService.getOrders('c-1');
    expect(customerOrders.some((o) => o.id === order.id)).toBe(true);

    // 4. Farmer sees order in Farmer orders
    const farmerOrders = dataService.getOrders(undefined, product.farmer_id);
    expect(farmerOrders.some((o) => o.id === order.id)).toBe(true);

    // 5. Admin sees order in Admin orders
    const allOrders = dataService.getOrders();
    expect(allOrders.some((o) => o.id === order.id)).toBe(true);

    // 6. Test order cancellation restores stock
    dataService.updateOrderStatus(order.id, 'cancelled');
    const restoredProduct = dataService.getProductBySlugOrId(product.id);
    expect(restoredProduct?.stock_qty).toBe(initialStock);
  });

  it('updates order status through lifecycle: placed -> packed -> shipped -> delivered', () => {
    const orders = dataService.getOrders();
    const targetOrder = orders[0];

    const updated1 = dataService.updateOrderStatus(targetOrder.id, 'packed');
    expect(updated1?.order_status).toBe('packed');

    const updated2 = dataService.updateOrderStatus(targetOrder.id, 'shipped');
    expect(updated2?.order_status).toBe('shipped');

    const updated3 = dataService.updateOrderStatus(targetOrder.id, 'delivered');
    expect(updated3?.order_status).toBe('delivered');
  });

  it('handles farmer onboarding and admin approval lifecycle', () => {
    // 1. Farmer registers
    const newFarmer = dataService.registerFarmer({
      name: 'Sunil Jadhav',
      email: 'sunil.organic@example.com',
      phone: '+91 99887 76655',
      farm_name: 'Sahyadri Agro Estate',
      village: 'Satara',
      district: 'Satara',
      state: 'Maharashtra',
      category: 'Grains & Spices',
      farming_type: '100% Organic Vedic',
      verification_details: 'NPOP-ORG-2024-MH-9921',
    });

    expect(newFarmer.status).toBe('pending_approval');

    // 2. Admin dashboard sees pending approval
    const adminStats = dataService.getAdminStats();
    expect(adminStats.pending_farmers).toBeGreaterThanOrEqual(1);

    // 3. Admin approves farmer
    const approved = dataService.updateFarmerStatus(newFarmer.id, 'approved');
    expect(approved?.status).toBe('approved');

    // 4. Admin suspends farmer if needed
    const suspended = dataService.updateFarmerStatus(newFarmer.id, 'suspended');
    expect(suspended?.status).toBe('suspended');
  });

  it('supports Wishlist and Saved Addresses management', () => {
    const userId = 'c-test-user';
    const products = dataService.getProducts();

    // Wishlist toggle
    const isAdded = dataService.toggleWishlist(userId, products[0].id);
    expect(isAdded).toBe(true);
    const wishlist = dataService.getWishlist(userId);
    expect(wishlist.some((p) => p.id === products[0].id)).toBe(true);

    const isRemoved = dataService.toggleWishlist(userId, products[0].id);
    expect(isRemoved).toBe(false);

    // Address management
    const address = dataService.addAddress(userId, {
      label: 'Farmhouse',
      line1: 'Farmhouse 12, Valley Road',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422003',
      is_default: true,
    });
    expect(address.id).toBeTruthy();

    const addresses = dataService.getAddresses(userId);
    expect(addresses.length).toBe(1);

    dataService.deleteAddress(userId, address.id!);
    expect(dataService.getAddresses(userId).length).toBe(0);
  });
});
