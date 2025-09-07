import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const { user } = useAuth();

  
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        await loadCartFromDB();
      } else {
        loadCartFromLocalStorage();
      }
    };

    loadCart();
  }, [user]);

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('guestCart');
  if (savedCart) {
    try {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      setTimeout(() => cleanupCorruptedCart(), 0);
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      localStorage.removeItem('guestCart');
    }
  }
};

const loadCartFromDB = async () => {
  try {
    setLoading(true);
    const response = await api.get('/api/cart');
    setCartItems(response.data.items || []);
    
    setTimeout(() => cleanupCorruptedCart(), 0);
  } catch (error) {
    console.error('Error loading cart:', error);
  } finally {
    setLoading(false);
  }
};

  const saveCartToLocalStorage = (items) => {
    const simplifiedItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      product: {
        _id: item.product?._id,
        title: item.product?.title,
        price: item.product?.price,
        image: item.product?.image,
        category: item.product?.category,
        rating: item.product?.rating
      }
    }));
    localStorage.setItem('guestCart', JSON.stringify(simplifiedItems));
  };

  const addToCart = async (product, quantity = 1) => {
    setOperationLoading(true);
    const newItem = {
      productId: product._id,
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating,
        description: product.description
      },
      quantity: quantity
    };

    let newCartItems;
    
    const existingItemIndex = cartItems.findIndex(
      item => item.productId === product._id
    );

    if (existingItemIndex > -1) {
      newCartItems = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCartItems = [...cartItems, newItem];
    }

    setCartItems(newCartItems);

    if (user) {
      try {
        await api.post('/api/cart/add', {
          productId: product._id,
          quantity: quantity
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      saveCartToLocalStorage(newCartItems);
    }
    setOperationLoading(false);
  };

  const removeFromCart = async (productId) => {
    setOperationLoading(true);
    const newCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(newCartItems);

    if (user) {
      try {
        await api.delete(`/api/cart/remove/${productId}`);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      saveCartToLocalStorage(newCartItems);
    }
    setOperationLoading(false);
  };

  const updateQuantity = async (productId, newQuantity) => {
    setOperationLoading(true);
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const newCartItems = cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCartItems(newCartItems);

    if (user) {
      try {
        await api.delete(`/api/cart/remove/${productId}`);
        await api.post('/api/cart/add', {
          productId: productId,
          quantity: newQuantity
        });
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      saveCartToLocalStorage(newCartItems);
    }
    setOperationLoading(false);
  };

  const clearCart = async () => {
    setOperationLoading(true);
    if (user) {
      try {
        await api.delete('/api/cart/clear');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      localStorage.removeItem('guestCart');
    }
    setCartItems([]);
    setOperationLoading(false);
  };

const getCartTotal = () => {
  return cartItems.reduce((total, item) => {
    
    if (!item || !item.product || typeof item.product.price !== 'number') {
      console.warn('Invalid cart item found:', item);
      return total;
    }
    return total + (item.product.price * item.quantity);
  }, 0);
};
const cleanupCorruptedCart = () => {
  const validItems = cartItems.filter(item => 
    item && 
    item.product && 
    typeof item.product.price === 'number' &&
    typeof item.quantity === 'number'
  );
  
  if (validItems.length !== cartItems.length) {
    console.log('Cleaning up corrupted cart items');
    setCartItems(validItems);
    if (!user) {
      saveCartToLocalStorage(validItems);
    }
  }
};

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    operationLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};