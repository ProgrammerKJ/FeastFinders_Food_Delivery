# FeastFinders

FeastFinders is a full-stack food delivery application that simplifies ordering food online. It features user authentication, an intuitive shopping cart, secure payments, order management, and an admin panel for restaurant owners.

## Video Walkthrough

[Insert link to video walkthrough here]

## Deployed Sites

- **Main Application:** [https://food-delivery-fe-gjj8.onrender.com](https://food-delivery-fe-gjj8.onrender.com)
- **Admin Panel:** [https://food-delivery-admin-xtr7.onrender.com](https://food-delivery-admin-xtr7.onrender.com)

**Note:** When adding items in the admin panel, please ensure images are 360 by 280 px for optimal display.

## Features

- **User Authentication:** Secure sign-up and login functionality.
- **Shopping Cart:** Add items, modify quantities, and proceed to checkout.
- **Payment Integration:** Secure test payments using Stripe API.
- **Order Management:** Track order status and view order history.
- **Admin Panel:** Manage menu items and update order statuses.
- **Real-time Updates:** Users receive notifications on order status changes.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Payment Processing:** Stripe API
- **Authentication:** JSON Web Tokens (JWT)

## Testing

FeastFinders employs a comprehensive testing strategy across all layers of the application:

- **Frontend:** 
  - Unit and integration tests using Vitest
  - End-to-end tests using Cypress

- **Backend:** 
  - Unit and integration tests using Jest

- **Admin Panel:** 
  - Unit and integration tests using Vitest

## Installation and Setup

To run FeastFinders locally, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository_url>
   cd FeastFinders
   ```

2. **Install Dependencies:**
   Navigate to each directory (frontend, backend, admin) and install dependencies:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   cd ../admin && npm install
   ```

3. **Set up MongoDB:**
   - Create a MongoDB database
   - Update the connection string in the `backend/config/database.js` file

4. **Configure Environment Variables:**
   Create `.env` files in the root of the backend and frontend directories with the necessary environment variables (e.g., database URL, Stripe API keys, etc.)

5. **Update API URLs:**
   In the frontend `Context` file, backend `server` file, and admin `assets.js` and `App.jsx` files, update the URLs to use `localhost` for local development.

6. **Start the Applications:**
   In separate terminal windows:
   ```
   # Start backend
   cd backend && npm start

   # Start frontend
   cd frontend && npm run dev

   # Start admin panel
   cd admin && npm run dev
   ```

## Running Tests

- **Frontend and Admin Panel Tests:**
  ```
  npm run test
  ```

- **Backend Tests:**
  ```
  npm run test
  ```

- **Cypress E2E Tests:**
  ```
  npm run cypress:open
  ```

## Contributing

We welcome contributions to FeastFinders! Please read our contributing guidelines before submitting pull requests.


---

We hope you enjoy using FeastFinders! If you have any questions or run into any issues, please don't hesitate to reach out or open an issue on GitHub.
