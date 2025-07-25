# MCShop Web Frontend

A React-based frontend application for the MCShop e-commerce platform, built with TypeScript and Tailwind CSS.

## Features

- **Authentication System**
  - User registration with OTP verification
  - User login/logout
  - Protected routes
  - Token-based authentication with automatic refresh

- **Product Management**
  - Browse products with pagination
  - Search and filter products by category
  - View detailed product information
  - Check product inventory status

- **Shopping Cart**
  - Add/remove products from cart
  - Update quantities
  - View cart summary
  - Proceed to checkout

- **User Profile**
  - View and edit personal information
  - Manage account details

- **Order Management**
  - Place orders with payment integration
  - View order status

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Create React App

## API Integration

The application integrates with the MCShop backend API running on `http://localhost:8080` and includes:

- **Auth Service**: Login, registration, OTP, token refresh
- **User Service**: Profile management
- **Product Service**: Product listing and details
- **Inventory Service**: Stock management
- **Order Service**: Order placement and management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MCShop backend running on `http://localhost:8080`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcshop-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/             # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CartPage.tsx
│   ├── ProfilePage.tsx
│   └── ProductDetailPage.tsx
├── services/          # API services
│   └── api.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Endpoints

The application uses the following API endpoints:

### Authentication
- `GET /api/v1/auth/otp` - Request OTP
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh token

### User Profile
- `GET /api/v1/user/profile/me` - Get user profile
- `POST /api/v1/user/profile` - Create user profile

### Products
- `GET /api/v1/product/all` - Get all products
- `GET /api/v1/product/{id}` - Get product by ID
- `GET /api/v1/product/inventory/{productId}` - Get inventory

### Orders
- `POST /api/v1/order/place` - Place order

## Error Handling

The application includes comprehensive error handling:

- Network error handling with retry mechanisms
- Form validation with user-friendly error messages
- API error responses with proper error codes
- Loading states for better UX

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Secure API communication
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
