require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const axios = require('axios');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    console.log('Starting advanced seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    
    
    const categoriesResponse = await axios.get('https://fakestoreapi.com/products/categories');
    const categories = categoriesResponse.data;
    
    console.log('Available categories:', categories);
    
    let allProducts = [];
    
    
    for (const category of categories) {
      console.log(`Fetching ${category} products...`);
      try {
        const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
        const products = response.data.map(product => ({
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          rating: {
            rate: product.rating.rate,
            count: product.rating.count
          }
        }));
        
        allProducts = [...allProducts, ...products];
        console.log(`Added ${products.length} ${category} products`);
        
      } catch (error) {
        console.log(`Could not fetch ${category}:`, error.message);
      }
    }
    
    
    await Product.insertMany(allProducts);
    console.log(`Successfully seeded ${allProducts.length} products!`);
    
    // Show statistics
    const productCount = await Product.countDocuments();
    const categoriesCount = await Product.distinct('category');
    
    console.log('\n Database Statistics:');
    console.log(`Total products: ${productCount}`);
    console.log(`Categories: ${categoriesCount.join(', ')}`);
    
    
    for (const category of categoriesCount) {
      const count = await Product.countDocuments({ category });
      console.log(`${category}: ${count} products`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();