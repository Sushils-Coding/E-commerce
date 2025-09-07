// Currency conversion rates
export const exchangeRates = {
  USD: 1,
  INR: 83.50,
};


export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Convert amount from USD to target currency
export const convertFromUSD = (usdAmount, targetCurrency = 'INR') => {
  return usdAmount * exchangeRates[targetCurrency];
};

// Convert amount to USD from source currency
export const convertToUSD = (amount, sourceCurrency = 'INR') => {
  return amount / exchangeRates[sourceCurrency];
};

// Format USD amount directly to target currency
export const formatFromUSD = (usdAmount, targetCurrency = 'INR') => {
  const convertedAmount = convertFromUSD(usdAmount, targetCurrency);
  return formatCurrency(convertedAmount, targetCurrency);
};