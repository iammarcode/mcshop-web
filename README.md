# MCShop Web

Customer-facing web application of MCShop built with React, TypeScript, Docker, and Nginx.

## Features

- ⚛️ **React 18** with TypeScript
- 🐳 **Docker** containerization with multi-stage builds
- 🌐 **Nginx** reverse proxy with API routing
- 🔄 **Hot reloading** for development
- 📱 **Responsive design** with modern UI
- 🔌 **API integration** with axios
- 🚀 **Production-ready** build configuration

## Project Structure

```
mcshop-web/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main App component
│   └── index.tsx          # Entry point
├── public/                # Static assets
├── backend/               # Simple Express.js API server
├── Dockerfile             # Production Docker build
├── Dockerfile.dev         # Development Docker build
├── docker-compose.yml     # Docker Compose configuration
├── nginx.conf             # Nginx configuration
└── package.json           # Node.js dependencies
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Development with Hot Reloading

1. **Start the development environment:**
   ```bash
   docker-compose up frontend backend
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health

3. **View API endpoints:**
   - GET `/api/products` - List all products
   - GET `/api/products/:id` - Get specific product
   - POST `/api/products` - Create new product

### Production Build

1. **Build and run production version:**
   ```bash
   docker-compose up frontend-prod backend
   ```

2. **Access the production application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

### Local Development (without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Start backend server:**
   ```bash
   cd backend
   npm start
   ```

3. **Start frontend development server:**
   ```bash
   npm start
   ```

## API Integration

The frontend is configured to communicate with the backend API through:

- **Development:** Proxy configuration in `package.json` (http://localhost:3001/api)
- **Production:** Nginx reverse proxy configuration

### API Service Layer

The application includes a comprehensive API service layer (`src/services/api.ts`) with:

- Axios instance with base configuration
- Request/response interceptors
- Error handling
- Authentication token management
- TypeScript type safety

## Docker Configuration

### Development (`Dockerfile.dev`)
- Uses Node.js 18 Alpine
- Includes all dependencies for hot reloading
- Mounts source code for live updates

### Production (`Dockerfile`)
- Multi-stage build for optimized image size
- Builds React app and serves with Nginx
- Includes security headers and compression

### Nginx Configuration
- Reverse proxy for API calls
- Static file serving with caching
- React Router support
- Gzip compression
- Security headers

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (defaults to http://localhost:3001/api)
- `NODE_ENV` - Environment mode (development/production)

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## License

This project is part of the MCShop application suite.
