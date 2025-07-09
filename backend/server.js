const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Sample product data
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 299.99,
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor and GPS capabilities.",
    price: 199.99,
    category: "Electronics"
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly cotton t-shirt available in multiple colors.",
    price: 29.99,
    category: "Clothing"
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 24.99,
    category: "Home & Garden"
  },
  {
    id: 5,
    name: "Professional Camera Lens",
    description: "High-quality 50mm f/1.8 lens perfect for portrait photography.",
    price: 399.99,
    category: "Electronics"
  },
  {
    id: 6,
    name: "Yoga Mat",
    description: "Non-slip yoga mat made from eco-friendly materials, perfect for home workouts.",
    price: 39.99,
    category: "Sports"
  }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MCShop API is running' });
});

app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products,
    message: 'Products retrieved successfully'
  });
});

app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: product,
    message: 'Product retrieved successfully'
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category } = req.body;
  
  if (!name || !description || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price: parseFloat(price),
    category
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    data: newProduct,
    message: 'Product created successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`MCShop API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
}); 