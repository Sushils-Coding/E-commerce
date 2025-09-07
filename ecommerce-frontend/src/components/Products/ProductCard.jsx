import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatFromUSD } from '../../utils/currency';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain p-4"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded capitalize">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              {formatFromUSD(product.price)}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-gray-600 ml-1 text-sm">
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;