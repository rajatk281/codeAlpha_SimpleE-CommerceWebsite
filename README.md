# LUXE BREW - Premium Coffee & Tea E-Commerce

A production-ready full stack e-commerce web application built using the MERN-equivalent stack with PostgreSQL (PERN). 
LUXE BREW specializes in premium, single-origin coffees and exquisite teas from around the world. The platform delivers a highly aesthetic, luxury shopping experience featuring glassmorphism design, dark mode aesthetics, and robust functionality.

## 🚀 Features

### **User Experience (Frontend)**
- **Luxury UI/UX:** Built with React, Tailwind CSS v3, and Framer Motion for a sleek, dark-themed, glassmorphic experience.
- **Product Discovery:** Search, filter (category, price, availability, featured), and sorting capabilities.
- **Shopping Cart & Wishlist:** Persistent cart and wishlist with optimistic UI updates.
- **Checkout Flow:** Integrated with Razorpay for secure payments and order creation.
- **User Dashboard:** Order history, timeline tracking, and invoice downloads.
- **Responsive Design:** Fully responsive layout with mobile navigation and optimized images.

### **Core Systems (Backend)**
- **Robust Architecture:** Layered REST API (Controller -> Service -> Repository -> Database).
- **Relational Data:** PostgreSQL database managed with Prisma ORM.
- **Authentication:** Secure JWT-based authentication with cookie persistence and bcrypt hashing.
- **Validation:** Request validation using Joi/Express-Validator (or custom schemas).
- **PDF Generation:** Automated invoice generation using `pdfkit`.
- **Security:** Helmet, CORS, Rate Limiting, and XSS protection built-in.

### **Admin Capabilities**
- **Dashboard:** Revenue tracking, order statistics, user count, and low stock alerts.
- **Product Management:** Full CRUD for products, categories, and inventory management.
- **Order Management:** View detailed orders, update statuses, and generate invoices.
- **User Management:** Manage users and assign admin roles.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router DOM, React Hook Form, Axios.
- **Backend:** Node.js, Express.js, Prisma ORM, JSON Web Tokens (JWT), pdfkit, Razorpay SDK.
- **Database:** PostgreSQL.
- **Deployment:** Docker, Docker Compose, Nginx.

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Local or managed e.g., Supabase/Neon)
- Docker (optional, for containerized execution)

### 1. Clone & Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables
Create `.env` files in both the `backend` and `frontend` directories based on the provided `.env.example` configurations.

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://user:password@localhost:5432/luxebrew?schema=public"
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

### 3. Database Setup & Seeding
Ensure PostgreSQL is running and your `DATABASE_URL` is correct.

```bash
cd backend
npx prisma db push
npm run seed
```
**Test Accounts Created by Seed:**
- Admin: `admin@luxebrew.com` / `admin123`
- User: `user@luxebrew.com` / `user123`

### 4. Running the Application (Locally)
**Start the Backend:**
```bash
cd backend
npm run dev
```

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 🐳 Docker Deployment

To run the entire stack using Docker Compose:

1. Ensure your `.env` files are configured.
2. Run the following command in the project root:
```bash
docker-compose up --build
```
This will spin up:
- PostgreSQL database
- Node.js backend on port 5000
- Nginx-served React frontend on port 80

## 📝 License

This project is licensed under the MIT License.
