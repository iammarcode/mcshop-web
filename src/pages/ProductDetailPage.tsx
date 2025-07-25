import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getInventory } from '../services/api';
import { Product, Inventory } from '../types';
import { useCart } from '../contexts/CartContext';
import Button from '../components/Button';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const [productData, inventoryData] = await Promise.all([
        getProductById(id!),
        getInventory(id!).catch(() => null) // Inventory might not be available
      ]);
      
      setProduct(productData);
      setInventory(inventoryData);
      setError(null);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [loadProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (inventory?.quantity || 999)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const currentCartQuantity = getItemQuantity(product.id);
  const availableQuantity = inventory?.quantity || 0;
  const isOutOfStock = availableQuantity === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="small"
              >
                Products
              </Button>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-blue-600 font-bold mb-4">
                ${(product.price / 100).toFixed(2)}
              </p>
              <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Inventory Status */}
            {inventory && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Availability</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {isOutOfStock ? 'Out of Stock' : `${availableQuantity} in stock`}
                  </span>
                  {!isOutOfStock && inventory.reservedQuantity > 0 && (
                    <span className="text-xs text-orange-600">
                      {inventory.reservedQuantity} reserved
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="space-y-4">
              {!isOutOfStock && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <Button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      variant="outline"
                      size="small"
                      disabled={quantity <= 1}
                      className="rounded-r-none border-r-0"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[60px]">
                      {quantity}
                    </span>
                    <Button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      variant="outline"
                      size="small"
                      disabled={quantity >= availableQuantity}
                      className="rounded-l-none border-l-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1"
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                <Button
                  onClick={() => navigate('/cart')}
                  variant="outline"
                >
                  View Cart ({currentCartQuantity})
                </Button>
              </div>

              {currentCartQuantity > 0 && (
                <div className="text-sm text-blue-600">
                  {currentCartQuantity} item(s) in your cart
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Product ID</dt>
                  <dd className="text-sm text-gray-900">{product.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Category</dt>
                  <dd className="text-sm text-gray-900">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Price</dt>
                  <dd className="text-sm text-gray-900">${(product.price / 100).toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 