# AgroMart — REST API Endpoint Specifications

All endpoints are prefixed with `/api`. Protected routes require standard `Authorization: Bearer <JWT_TOKEN>` header.

## 1. Auth (`/api/auth`)
- `POST /auth/register` — Body: `{ name, email, password, role, phone? }` -> Returns `{ access_token, refresh_token, token_type, user }`
- `POST /auth/login` — Body: `{ email, password }` -> Returns `{ access_token, refresh_token, token_type, user }`
- `POST /auth/google` — Body: `{ id_token }` -> Returns `{ access_token, refresh_token, token_type, user }`
- `POST /auth/refresh` — Body: `{ refresh_token }` -> Returns `{ access_token }`
- `GET /auth/me` — Protected -> Returns current user profile

## 2. Categories & Products (`/api/categories`, `/api/products`)
- `GET /categories` -> List full category tree
- `POST /categories` -> Admin only: Create category
- `GET /products` -> Filterable listing: `category`, `search`, `min_price`, `max_price`, `is_organic`, `min_rating`, `sort`, `page`, `limit`
- `GET /products/featured` -> Top organic picks and seasonal items
- `GET /products/search?q=` -> Text search index search
- `GET /products/{slug}` -> Complete product detail view
- `POST /products` -> Farmer / Admin: Create product
- `PUT /products/{id}` -> Farmer / Admin: Update product
- `DELETE /products/{id}` -> Farmer / Admin: Delete product

## 3. Cart & Wishlist (`/api/cart`, `/api/wishlist`)
- `GET /cart` -> Get current user's active cart with product snapshots
- `POST /cart/items` -> Body: `{ product_id, qty }` -> Add/update item
- `PATCH /cart/items/{product_id}` -> Body: `{ qty }` -> Update quantity
- `DELETE /cart/items/{product_id}` -> Remove item from cart
- `DELETE /cart` -> Clear cart
- `GET /wishlist` -> Get user wishlist products
- `POST /wishlist/{product_id}` -> Add product to wishlist
- `DELETE /wishlist/{product_id}` -> Remove product from wishlist

## 4. Checkout & Orders (`/api/checkout`, `/api/orders`)
- `POST /checkout/calculate` -> Body: `{ address_id, coupon_code? }` -> Returns calculation breakdown `{ subtotal, gst, delivery_fee, discount, total }`
- `POST /checkout/create-order` -> Body: `{ address_id, coupon_code?, payment_method: "razorpay" | "cod" }` -> Creates pending order and Razorpay order (if razorpay method)
- `POST /checkout/verify-payment` -> Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` -> Verifies server HMAC, marks paid, decrements stock
- `GET /orders` -> User order history
- `GET /orders/{id}` -> Order detail with status timeline
- `PATCH /orders/{id}/status` -> Farmer/Admin: Update status (`packed`, `shipped`, `delivered`, `cancelled`)

## 5. Payments (`/api/payments`)
- `POST /payments/webhook` -> Razorpay webhook receiver with HMAC signature verification

## 6. Farmer Dashboard (`/api/farmer`)
- `GET /farmer/profile` -> Farmer bio, farm info, ratings
- `GET /farmer/analytics` -> Revenue breakdown, top selling products, order counts
- `GET /farmer/inventory` -> Products owned by logged-in farmer
- `GET /farmer/orders` -> Orders containing farmer's products

## 7. Admin Dashboard (`/api/admin`)
- `GET /admin/users` -> Manage users and farmer verification states
- `PATCH /admin/farmers/{id}/verify` -> Toggle verified flag for farmer profile
- `GET /admin/analytics` -> Platform-wide sales, metrics, user growth
- `GET /admin/coupons` / `POST /admin/coupons` -> Coupon CRUD

## 8. Reviews & Notifications (`/api/reviews`, `/api/notifications`)
- `GET /reviews?product_id=` -> Product reviews
- `POST /reviews` -> Create review (verified purchase check enforced)
- `GET /notifications` -> User notifications list
- `PATCH /notifications/{id}/read` -> Mark notification as read
