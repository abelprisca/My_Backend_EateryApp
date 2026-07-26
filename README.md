# 🍽️ Online Eatery Backend

## Project Title

**Online Eatery Backend – RESTful API for Food Ordering System**

---

## Project Description

The Online Eatery Backend is a RESTful API developed using Node.js, Express.js, and MongoDB to power the Online Eatery web application. It provides secure user authentication, menu management, order processing, and administrative functionalities. The backend exposes RESTful endpoints that allow the frontend application to register users, authenticate customers and administrators, manage menu items, process orders, and retrieve analytics. Security measures such as JSON Web Tokens (JWT), password hashing, input validation, and HTTP security middleware are implemented to ensure a secure and reliable application.

---

## Live Links

### Backend API (Render)

https://your-backend.onrender.com/api

### Frontend Application

/priscamyeateryapp.vercel.app
### API Documentation (Postman/Swagger)

https://your-api-documentation-link(later)

---

## Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer
- Zod
- Helmet
- CORS
- Cookie Parser
- dotenv

### Deployment

- Render
- MongoDB Atlas
- vercel
---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing
- Protected Routes
- Role-Based Authorization

### Menu Management

- Create Menu Items
- Retrieve Menu Items
- Update Menu Items
- Delete Menu Items
- Upload Food Images

### Order Management

- Place Orders
- Retrieve Customer Orders
- Retrieve All Orders (Admin)
- Update Order Status
- Cancel Orders

### Security

- Helmet Security Headers
- CORS Configuration
- Input Validation
- Error Handling Middleware
- Cookie Parsing

---

## Installation and Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abelprisca/My_Backend_EateryApp.git
```

### 2. Navigate into the Project

```bash
cd eatery-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create a `.env` File

Add the required environment variables.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173,https://priscamyeateryapp.vercel.app
```

### 5. Start the Development Server

```bash
npm run dev
```

The backend API will run at:

```
http://localhost:5000
```

---

## Required Environment Variables

The backend requires the following environment variables:

- PORT
- NODE_ENV
- MONGO_URI
- JWT_SECRET
- CORS_ORIGIN

> **Note:** Never commit your `.env` file or secret values to GitHub.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/profile` | Retrieve authenticated user profile |

---

### Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Retrieve all menu items |
| GET | `/api/menu/:id` | Retrieve a specific menu item |
| POST | `/api/menu` | Create a menu item (Admin) |
| PUT | `/api/menu/:id` | Update a menu item (Admin) |
| DELETE | `/api/menu/:id` | Delete a menu item (Admin) |

---

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders/my-orders` | Retrieve logged-in user's orders |
| GET | `/api/orders` | Retrieve all orders (Admin) |
| PATCH | `/api/orders/:id/status` | Update order status |
| PATCH | `/api/orders/:id/cancel` | Cancel an order |

For complete API details, please refer to the API documentation.

---

## Project Structure

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── package.json
├── .env.example
└── README.md
```

---

## Testing

The API can be tested using:

- Postman
---

## Known Limitations

The current version of the backend has the following limitations:

- Online payment gateway integration has not been implemented.
- Email notifications are not supported.
- Password reset via email is not available.
- Menu images are stored locally instead of using cloud storage.
- Inventory management is not implemented.
- Real-time notifications using WebSockets are not available.

These features are planned for future development.

---

## Author

**Priscilla Abel**


---

## Submission Information

**Project:** Online Eatery Backend

**Cohort:** *(7.0)*

**Submission Date:** **27 July 2026**

---

## License

This project is developed for educational purposes and learning. Feel free to use and modify it for academic or personal projects.


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


