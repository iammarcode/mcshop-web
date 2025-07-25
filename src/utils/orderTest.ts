// Test utility to verify order data structure
export const createTestOrderData = (products: any[]) => {
  return {
    products: products.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    currency: 'USD',
  };
};

// Validate order data structure
export const validateOrderData = (orderData: any): boolean => {
  const requiredFields = ['products', 'currency'];
  
  for (const field of requiredFields) {
    if (!(field in orderData)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
    console.error('Products array is required and cannot be empty');
    return false;
  }
  
  for (const product of orderData.products) {
    if (!product.productId || !product.quantity) {
      console.error('Each product must have productId and quantity');
      return false;
    }
  }
  
  return true;
}; 