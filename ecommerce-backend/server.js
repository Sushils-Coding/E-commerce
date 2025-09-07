const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON bodies


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

// Temporary: Create a test product if none exist
const Product = require('./models/Product');
async function createTestProduct() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const testProduct = new Product({
      title: "Test T-Shirt",
      price: 29.99,
      description: "A comfortable cotton t-shirt for testing",
      category: "clothing",
      image: "https://via.placeholder.com/300x400?text=Test+T-Shirt"
    });
    await testProduct.save();
    console.log('Test product created with ID:', testProduct._id);
  }
}
createTestProduct();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});