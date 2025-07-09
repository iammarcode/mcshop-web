import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchProducts } from './services/api';
import { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MCShop - Customer Portal</h1>
        <p>Welcome to our online store</p>
      </header>
      
      <main className="App-main">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="products-grid">
            {products.length === 0 ? (
              <p>No products available</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <p className="description">{product.description}</p>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 