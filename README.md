# FeastFinders 🍕

**A comprehensive full-stack food delivery application with real-time order tracking, secure payments, and administrative management.**

## 🚀 Live Demo
* **Main Application:** https://food-delivery-fe-gjj8.onrender.com
* **Admin Panel:** https://food-delivery-admin-xtr7.onrender.com

### Demo Credentials
**Customer Account:**
- Email: demo@customer.com
- Password: demo123

**Admin Account:**
- Email: admin@feastfinders.com  
- Password: admin123

> **Note:** Use Stripe test card `4242 4242 4242 4242` for payment testing

## ✨ Key Features

### Customer Experience
- 🔐 **Secure Authentication** - JWT-based user registration and login
- 🛒 **Dynamic Shopping Cart** - Add/remove items with real-time price calculation
- 💳 **Stripe Payment Integration** - Secure test payment processing
- 📱 **Order Tracking** - Real-time order status updates
- 📋 **Order History** - View past orders and reorder favorites

### Administrative Features  
- 🎛️ **Admin Dashboard** - Comprehensive restaurant management panel
- 📊 **Menu Management** - Add, edit, and remove menu items with image upload
- 📦 **Order Management** - Update order statuses and track deliveries
- 📈 **Analytics** - Order statistics and sales tracking

## 🛠️ Technical Stack

**Frontend (React.js)**
- React 18 with functional components and hooks
- Context API for state management
- Responsive design with CSS modules
- Axios for API communication

**Backend (Node.js + Express.js)**
- RESTful API design
- JWT authentication middleware
- MongoDB integration with Mongoose
- Stripe API for payment processing
- Real-time order updates

**Database (MongoDB)**
- User authentication and profiles
- Product catalog management
- Order processing and history
- Administrative data

**Testing Strategy**
- **Frontend/Admin:** Vitest for unit & integration tests
- **Backend:** Jest for API endpoint testing  
- **E2E:** Cypress for full user journey testing
- **90%+ test coverage** across all components

## 🏗️ Architecture

```
Frontend (React) ←→ Backend API (Express) ←→ MongoDB
     ↓                    ↓
Admin Panel (React)   Stripe Payment API
     ↓
Cypress E2E Testing
```

## 📱 Screenshots

### Customer Interface
![Landing Page](https://github.com/user-attachments/assets/993ce4dd-f680-40a6-9a93-64f88a985007)
![Landing Page - Menu](https://github.com/user-attachments/assets/b4d12c3c-8437-445c-9749-42925341329d)
![Signup Popup](https://github.com/user-attachments/assets/57c6a1b1-70eb-482d-a671-c7381fec06ae)
![Login Popup](https://github.com/user-attachments/assets/c3c6e332-3c45-40e4-b7a3-cd8f3202c9cc)
![Add Item Functionality](https://github.com/user-attachments/assets/934d3e72-9091-4a83-9bf8-8d684db4f853)
![Shopping Cart](https://github.com/user-attachments/assets/e7b814ec-941c-473f-97ea-ea852ebc3c44)
![Checkout Functionality](https://github.com/user-attachments/assets/a360de32-449c-4697-aae3-48306beb0311)
![Stripe Functionality](https://github.com/user-attachments/assets/fcf1d099-0975-4184-bd2d-720ea2e3b4d8)
![Orders Page](https://github.com/user-attachments/assets/dde7e928-de0f-4bf4-b5d2-3cfe631cd9f2)

### Admin Panel
![Admin Dashboard - Add Items](https://github.com/user-attachments/assets/6a81a030-fcbc-4607-a7d7-10eaabe8e59c)
![Admin Dashboard - List Items](https://github.com/user-attachments/assets/f0e683a4-3484-4629-b735-882ce2ad50a0)
![Admin Dashboard - Orders](https://github.com/user-attachments/assets/918a97d4-25ea-464c-a010-27fecb02497b)

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payment testing

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/programmerKJ/FeastFinders_Food_Delivery.git
cd FeastFinders_Food_Delivery
```

2. **Install dependencies for all modules:**
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../frontend && npm install

# Install admin panel dependencies
cd ../admin && npm install
```

3. **Environment Setup:**
Create `.env` files in backend directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. **Start all services:**
```bash
# Terminal 1 - Backend API
cd backend && npm start

# Terminal 2 - Customer Frontend
cd frontend && npm run dev

# Terminal 3 - Admin Panel
cd admin && npm run dev
```

5. **Access Applications:**
- Customer App: `http://localhost:5173`
- Admin Panel: `http://localhost:5174`  
- Backend API: `http://localhost:4000`

## 🧪 Testing

### Run All Tests
```bash
# Frontend tests
cd frontend && npm run test

# Backend tests  
cd backend && npm run test

# Admin panel tests
cd admin && npm run test

# E2E tests
cd frontend && npm run cypress:open
```

### Test Coverage
- **Backend API:** 95% coverage with Jest
- **Frontend Components:** 90% coverage with Vitest
- **E2E User Flows:** Complete checkout process testing

## 🎯 Technical Highlights

- **Modular Architecture:** Separate frontend, backend, and admin applications
- **Real-time Updates:** Order status changes reflected instantly
- **Secure Payments:** PCI-compliant Stripe integration
- **Comprehensive Testing:** Unit, integration, and E2E test coverage
- **Production Deployment:** Hosted on Render with CI/CD pipeline
- **Responsive Design:** Mobile-first approach with CSS Grid/Flexbox

## 📊 Performance Metrics

- **Load Time:** < 2 seconds initial page load
- **API Response:** < 200ms average response time
- **Test Coverage:** 90%+ across all modules
- **Mobile Responsive:** Optimized for all device sizes

## 🔮 Future Enhancements

- [ ] Real-time chat support
- [ ] GPS delivery tracking
- [ ] Push notifications
- [ ] Multi-restaurant support
- [ ] Advanced analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ by Krishna Joshi**  
[LinkedIn](https://linkedin.com/in/krishnajoshi28) | [Portfolio](krishnasportfolio23.netlify.app)
