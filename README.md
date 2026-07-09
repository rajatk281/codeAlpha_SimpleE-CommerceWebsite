# LUXE BREW - Premium Coffee & Tea E-Commerce

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>

<br/>

A production-ready full stack e-commerce web application built using the PERN stack (PostgreSQL, Express, React, Node.js). 

LUXE BREW specializes in premium, single-origin coffees and exquisite teas from around the world. The platform delivers a highly aesthetic, luxury shopping experience featuring glassmorphism design, dark mode aesthetics, and robust functionality.

## 🚀 Features

### **User Experience (Frontend)**
- **Luxury UI/UX:** Built with React, Tailwind CSS, and Framer Motion for a sleek, dark-themed, glassmorphic experience.
- **Product Discovery:** Search, filter (category, price, availability, featured), and sorting capabilities.
- **Shopping Cart & Wishlist:** Persistent cart and wishlist with optimistic UI updates.
- **Checkout Flow:** Integrated with **Razorpay** for secure payments and order creation.
- **User Dashboard:** Order history, timeline tracking, and invoice downloads.
- **Responsive Design:** Fully responsive layout with mobile navigation and optimized images.

### **Core Systems (Backend)**
- **Robust Architecture:** Layered REST API (Controller -> Service -> Repository -> Database).
- **Relational Data:** PostgreSQL database managed with **Prisma ORM**.
- **Authentication:** Secure JWT-based authentication with cookie persistence and bcrypt hashing.
- **Validation:** Request validation using Joi schemas.
- **PDF Generation:** Automated invoice generation using `pdfkit`.
- **Security:** Helmet, CORS, Rate Limiting, and XSS protection built-in.

### **Admin Capabilities**
- **Dashboard:** Revenue tracking, order statistics, user count, and low stock alerts.
- **Product Management:** Full CRUD for products, categories, and inventory management.
- **Order Management:** View detailed orders, update statuses, and generate invoices.
- **User Management:** Manage users and assign admin roles.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v3, Framer Motion, React Router DOM v7, React Hook Form, Axios, Lucide React, React Hot Toast.
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL, JSON Web Tokens (JWT), PDFKit, Razorpay SDK, Joi, Winston (Logging).
- **Deployment:** Docker, Docker Compose.

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
Ensure PostgreSQL is running and your `DATABASE_URL` is correct in `backend/.env`.

```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```
**Test Accounts Created by Seed:**
- Admin: `admin@luxebrew.com` / `admin123`
- User: `user@luxebrew.com` / `user123`

### 4. Running the Application (Locally)
Open two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
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
