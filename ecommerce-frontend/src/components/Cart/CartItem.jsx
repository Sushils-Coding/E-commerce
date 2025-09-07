import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatFromUSD } from '../../utils/currency';

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { updateQuantity, removeFromCart } = useCart();

  // Safety check for missing product data
  if (!item || !item.product) {
    return (
      <div className="p-6 flex items-center space-x-4 bg-red-50">
        <div className="text-red-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-red-800 font-medium">Invalid product</p>
          <p className="text-red-600 text-sm">This item cannot be displayed</p>
        </div>
        <button
          onClick={() => removeFromCart(item?.productId)}
          className="text-red-600 hover:text-red-800 p-2 transition-colors"
          title="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };


  const totalPriceUSD = item.product.price * item.quantity;

  return (
    <div className="p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors">
      
      <div className="flex-shrink-0">
        <img
          src={item.product.image || '/placeholder-image.jpg'}
          alt={item.product.title}
          className="w-20 h-20 object-contain rounded-lg"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEM0My4zMTM3IDQwIDQ2IDM3LjMxMzcgNDYgMzRDNDYgMzAuNjg2MyA0My4zMTM3IDI4IDQwIDI4QzM2LjY4NjMgMjggMzQgMzAuNjg2MyAzNCAzNEMzNCAzNy4zMTM3IDM2LjY4NjMgNDAgNDAgNDBaIiBmaWxsPSIjOEM5MEE2Ii8+CjxwYXRoIGQ9Ik00MCA0NC41QzMyLjU0ODcgNDQuNSAyNi4zNzQ1IDM5LjE1NjMgMjUuNSAzMkg1NC41QzUzLjYyNTUgMzkuMTU2MyA0Ny40NTEzIDQ0LjUgNDAgNDQuNVoiIGZpbGw9IiM4QzkwQTYiLz4KPC9zdmc+';
          }}
        />
      </div>

      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.product.title || 'Unknown Product'}
        </h3>
        <p className="text-gray-600 text-sm capitalize">{item.product.category || 'uncategorized'}</p>
        <p className="text-green-600 font-medium">{formatFromUSD(item.product.price)}</p>
        
        {/* Rating */}
        {item.product.rating && (
          <div className="flex items-center mt-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-gray-600 text-sm ml-1">
              {item.product.rating.rate} ({item.product.rating.count})
            </span>
          </div>
        )}
      </div>

      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">-</span>
        </button>
        
        <span className="w-10 text-center font-medium">{quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= 10}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">{formatFromUSD(totalPriceUSD)}</p>
        <p className="text-sm text-gray-600">
          {item.quantity} × {formatFromUSD(item.product.price)}
        </p>
      </div>

      
      <button
        onClick={handleRemove}
        className="text-red-600 hover:text-red-800 p-2 transition-colors"
        title="Remove item"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;