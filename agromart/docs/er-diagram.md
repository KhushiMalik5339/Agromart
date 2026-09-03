# AgroMart — MongoDB Entity-Relationship (ER) Diagram & Schema Specifications

```mermaid
erDiagram
    USERS ||--o| FARMER_PROFILES : "has profile (role=farmer)"
    USERS ||--o{ ADDRESSES : "owns"
    USERS ||--o| CARTS : "has active cart"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o| WISHLISTS : "maintains"
    USERS ||--o{ NOTIFICATIONS : "receives"
    
    FARMER_PROFILES ||--o{ PRODUCTS : "supplies"
    CATEGORIES ||--o{ PRODUCTS : "classifies"
    CATEGORIES ||--o{ CATEGORIES : "parent of"
    
    CARTS ||--o{ PRODUCTS : "contains items"
    ORDERS ||--o{ PRODUCTS : "contains item snapshots"
    ORDERS ||--o1 ADDRESSES : "ships to"
    ORDERS ||--o1 PAYMENTS : "has transaction"
    ORDERS ||--o? COUPONS : "applies discount"
```

## Collection Specifications

### 1. `users`
- `_id`: ObjectId
- `name`: string
- `email`: string (indexed, unique)
- `phone`: string (optional)
- `password_hash`: string
- `role`: string ("customer" | "farmer" | "admin")
- `google_id`: string (optional)
- `avatar_url`: string (optional)
- `created_at`: datetime

### 2. `farmer_profiles`
- `_id`: ObjectId
- `user_id`: ObjectId (ref: `users._id`, unique)
- `farm_name`: string
- `bio`: string
- `location`: object `{ address: string, city: string, state: string, lat: float, lng: float }`
- `verified`: boolean
- `rating_avg`: float
- `created_at`: datetime

### 3. `categories`
- `_id`: ObjectId
- `name`: string
- `slug`: string (indexed, unique)
- `icon`: string
- `parent_id`: ObjectId (optional, ref: `categories._id`)

### 4. `products`
- `_id`: ObjectId
- `farmer_id`: ObjectId (ref: `farmer_profiles._id`)
- `title`: string
- `slug`: string (indexed, unique)
- `category_id`: ObjectId (ref: `categories._id`, indexed)
- `description`: string
- `benefits`: array of strings
- `nutrition`: object `{ calories: string, protein: string, carbs: string, fats: string }`
- `images`: array of strings (URLs)
- `video_url`: string (optional)
- `price`: float
- `unit`: string ("kg" | "g" | "dozen" | "litre" | "pack")
- `stock_qty`: int
- `is_organic`: boolean
- `badges`: array of strings
- `rating_avg`: float
- `rating_count`: int
- `status`: string ("active" | "out_of_stock" | "draft")
- `created_at`: datetime

### 5. `carts`
- `_id`: ObjectId
- `user_id`: ObjectId (ref: `users._id`, indexed, unique)
- `items`: array of `{ product_id: ObjectId, qty: int, price_snapshot: float }`
- `updated_at`: datetime

### 6. `addresses`
- `_id`: ObjectId
- `user_id`: ObjectId (ref: `users._id`, indexed)
- `label`: string ("Home" | "Work" | "Other")
- `line1`: string
- `line2`: string (optional)
- `city`: string
- `state`: string
- `pincode`: string
- `is_default`: boolean

### 7. `orders`
- `_id`: ObjectId
- `order_number`: string (indexed, unique, e.g., "AGM-849201")
- `user_id`: ObjectId (ref: `users._id`, indexed)
- `items`: array of `{ product_id: ObjectId, title: string, price: float, qty: int, unit: string, image: string }`
- `address`: object (snapshot of address)
- `subtotal`: float
- `gst`: float (5%)
- `delivery_fee`: float
- `discount`: float
- `total`: float
- `payment_status`: string ("pending" | "paid" | "failed" | "pending_cod")
- `order_status`: string ("placed" | "packed" | "shipped" | "delivered" | "cancelled")
- `razorpay_order_id`: string (optional)
- `razorpay_payment_id`: string (optional)
- `created_at`: datetime

### 8. `payments`
- `_id`: ObjectId
- `order_id`: ObjectId (ref: `orders._id`, indexed)
- `razorpay_order_id`: string
- `razorpay_payment_id`: string
- `razorpay_signature`: string
- `amount`: float
- `status`: string ("created" | "captured" | "failed")
- `method`: string ("upi" | "card" | "netbanking" | "cod")
- `created_at`: datetime

### 9. `coupons`
- `_id`: ObjectId
- `code`: string (unique, uppercase)
- `discount_type`: string ("flat" | "percent")
- `value`: float
- `min_order_value`: float
- `valid_from`: datetime
- `valid_to`: datetime
- `usage_limit`: int
- `used_count`: int

### 10. `reviews`
- `_id`: ObjectId
- `product_id`: ObjectId (ref: `products._id`, indexed)
- `user_id`: ObjectId (ref: `users._id`)
- `rating`: int (1 to 5)
- `comment`: string
- `photos`: array of strings
- `verified_purchase`: boolean
- `created_at`: datetime

### 11. `wishlists`
- `_id`: ObjectId
- `user_id`: ObjectId (ref: `users._id`, indexed, unique)
- `product_ids`: array of ObjectIds

### 12. `notifications`
- `_id`: ObjectId
- `user_id`: ObjectId (ref: `users._id`, indexed)
- `type`: string ("order" | "offer" | "payment" | "system")
- `title`: string
- `body`: string
- `read`: boolean
- `created_at`: datetime
