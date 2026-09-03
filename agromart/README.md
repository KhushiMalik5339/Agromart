# AgroMart — Organic Modernist Farm-to-Home Full-Stack Marketplace

AgroMart is a full-stack e-commerce marketplace connecting local organic farmers directly to consumers with a modern, high-contrast, tactile design system.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Zustand, React Query (`@tanstack/react-query`), Axios, React Hook Form, Zod
- **Backend:** Python 3.11+, FastAPI, Motor (Async MongoDB), Pydantic v2, PyJWT, passlib (bcrypt)
- **Database:** MongoDB 6.0+
- **Integrations:** Razorpay Payment Gateway (UPI, Cards, Netbanking, COD), Google OAuth 2.0
- **Orchestration:** Docker & Docker Compose

---

## 🚀 Quick Start (Local Development)

### 1. Standalone Execution

#### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m app.utils.seed_db   # Seed MongoDB with sample farmers, products, and categories
uvicorn app.main:app --reload --port 8000
```
FastAPI Swagger interactive documentation is available at `http://localhost:8000/docs`.

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### 2. Docker Compose (One Command Startup)

```bash
docker-compose up --build
```

---

## 🔑 Default Test Credentials (Seeded)

| Role | Email | Password |
|---|---|---|
| Customer | `customer@agromart.com` | `password123` |
| Farmer | `farmer@agromart.com` | `password123` |
| Admin | `admin@agromart.com` | `password123` |

---

## 📑 Monorepo Architecture

```
agromart/
├── docs/                      # Design system tokens, REST API specs, ER Diagram
├── backend/                   # FastAPI application & MongoDB Motor driver
│   ├── app/
│   │   ├── core/              # Security, JWT, Environment config
│   │   ├── db/                # Motor MongoDB connection & indexes
│   │   ├── models/            # Pydantic v2 request/response schemas
│   │   ├── routers/           # Auth, Products, Cart, Checkout, Farmer, Admin...
│   │   ├── services/          # Business logic per domain
│   │   ├── integrations/      # Razorpay client & Google OAuth validator
│   │   └── utils/             # Seed DB script
│   └── tests/                 # pytest test suite
└── frontend/                  # React + Vite + TypeScript application
    ├── src/
    │   ├── components/        # Reusable UI primitives (Buttons, Cards, Inputs)
    │   ├── features/          # Feature domain modules
    │   ├── pages/             # Route-level pages
    │   ├── layouts/           # Layout wrappers (Public, App, Farmer, Admin)
    │   ├── store/             # Zustand auth & cart state management
    │   └── styles/            # Tailwind theme matching DESIGN.md tokens
```
