import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, getItemQuantity } = useCart();
  const currentQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${(product.price / 100).toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="small"
            className="flex-1"
          >
            {currentQuantity > 0 ? `Add More (${currentQuantity})` : 'Add to Cart'}
          </Button>
          
          <Button
            onClick={handleViewDetails}
            variant="outline"
            size="small"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 