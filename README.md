# Eatery Express.js Backend API (MongoDB)

A secure, modern Express.js API designed for eatery applications. Built with Node.js ES Modules, Mongoose, MongoDB, Zod validation, JWT cookies, and rate limiting.

## Technology Stack

- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Security**: JWT (HttpOnly Cookies), BcryptJS, Helmet, Express Rate Limit, CORS
- **Validation**: Zod
- **Architecture**: Separated Controllers, Models, Routes, and Middleware

---

## Setup Instructions

### 1. Configure Workspace
The project is saved directly on your Desktop:
`C:\Users\user\Desktop\eatery-backend`

### 2. Environment Variables
A default `.env` file is generated at the root. Make sure your local MongoDB instance is running, or replace the connection string with your MongoDB Atlas credentials:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_eatery_backend_key_2026_change_me
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/eatery
```

### 3. Seed Database
Pre-populate the MongoDB collections with premium mock menu items (Appetizers, Mains, Desserts, and Drinks):
```bash
npm run db:seed
```

### 4. Start the Server
Start the development server with hot-reload enabled via `nodemon`:
```bash
npm run dev
```

---

## API Documentation

### Health Check
- `GET /health` - Checks API connectivity.

---

### Authentication (`/api/auth`)
*Note: Rate limited to a maximum of 20 requests per 15 minutes.*

#### Sign Up User
- **URL**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "securepassword",
    "name": "Jane Doe",
    "phone": "+1234567890", // optional
    "address": "123 Main St, New York, NY" // optional
  }
  ```
- **Response**: Sets JWT `token` in an HttpOnly cookie and returns the user object.

#### Log In User
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "customer@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Sets JWT `token` in an HttpOnly cookie and returns the user object.

#### Log Out User
- **URL**: `POST /api/auth/logout`
- **Response**: Clears the JWT `token` cookie.

#### View Profile
- **URL**: `GET /api/auth/profile`
- **Headers**: Cookie `token=<jwt>` or `Authorization: Bearer <jwt>`
- **Response**: Returns current user profile details.

---

### Menu Management (`/api/menu`)

#### Get All Menu Items (Public)
- **URL**: `GET /api/menu`
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., `Mains`, `Appetizers`)
  - `search` (optional): Search by name or description
  - `dietary` (optional): Comma-separated list of dietary tags (e.g., `vegetarian,gluten-free`)
  - `sortBy` (optional): Sort by price (`priceAsc`, `priceDesc`)

#### Get Single Menu Item (Public)
- **URL**: `GET /api/menu/:id`

#### Create Menu Item (Admin Only)
- **URL**: `POST /api/menu`
- **Body**:
  ```json
  {
    "name": "Avocado Grilled Salmon Bowl",
    "description": "Fresh grilled Atlantic salmon with jasmine rice...",
    "price": 22.50,
    "category": "Mains",
    "isDietary": "gluten-free"
  }
  ```

#### Update Menu Item (Admin Only)
- **URL**: `PATCH /api/menu/:id`

#### Delete Menu Item (Admin Only)
- **URL**: `DELETE /api/menu/:id`

---

### Order Flow (`/api/orders`)
*All order routes require authentication.*

#### Place a New Order
- **URL**: `POST /api/orders`
- **Body**:
  ```json
  {
    "deliveryAddress": "456 Oak St, Brooklyn, NY", // optional (defaults to user address)
    "items": [
      {
        "menuItemId": "65ddc86f012a3456789abcde", // 24-character hex ID
        "quantity": 2
      }
    ]
  }
  ```

#### Get My Order History
- **URL**: `GET /api/orders/my-orders`

#### Get Single Order Details
- **URL**: `GET /api/orders/:id`
- *Note: Only the ordering customer or an Admin can fetch this.*

#### Cancel Order
- **URL**: `POST /api/orders/:id/cancel`
- *Note: Allowed only if order status is still `PENDING`.*

#### Get All Orders (Admin Only)
- **URL**: `GET /api/orders/admin/all`

#### Update Order Status (Admin Only)
- **URL**: `PATCH /api/orders/admin/:id/status`
- **Body**:
  ```json
  {
    "status": "PREPARING" // PENDING, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
  }
  ```
