import { useCart } from '../context/CartContext';

export const useSafeCart = () => {
  const cart = useCart();
  
  const getSafeCartTotal = () => {
    return cart.cartItems.reduce((total, item) => {
      if (!item || !item.product || typeof item.product.price !== 'number') {
        return total;
      }
      return total + (item.product.price * item.quantity);
    }, 0);
  };
  

  const safeCartItems = cart.cartItems.filter(item => 
    item && 
    item.product && 
    typeof item.product.price === 'number' &&
    typeof item.quantity === 'number'
  );
  
  return {
    ...cart,
    cartItems: safeCartItems,
    getCartTotal: getSafeCartTotal,
    getCartItemsCount: () => safeCartItems.reduce((total, item) => total + item.quantity, 0)
  };
};