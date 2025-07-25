import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { placeOrder } from '../services/api';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { validateOrderData } from '../utils/orderTest';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, using placeholder values
      const orderData = {
        products: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        currency: 'USD',
      };

      // Validate order data before sending
      if (!validateOrderData(orderData)) {
        setError('Invalid order data. Please try again.');
        return;
      }

      const response = await placeOrder(orderData);
      
      if (response.success) {
        // Redirect to payment URL or show success message
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else {
          alert('Order placed successfully!');
          clearCart();
          navigate('/');
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
          >
            Continue Shopping
          </Button>
        </div>

        {error && (
          <ErrorMessage
            error={error}
            onRetry={handleCheckout}
            onClose={() => setError(null)}
            showRetry={true}
            showClose={true}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                        }}
                      />
                      
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product.category}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${(item.product.price / 100).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          variant="outline"
                          size="small"
                        >
                          -
                        </Button>
                        
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          variant="outline"
                          size="small"
                        >
                          +
                        </Button>
                        
                        <Button
                          onClick={() => removeFromCart(item.product.id)}
                          variant="danger"
                          size="small"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(total / 100).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  Proceed to Checkout
                </Button>
                
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 