const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');  

dotenv.config();
const app = express();

app.use(cors({
  origin: '*', // allow all origins (for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
}));
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount user routes
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => res.send('Secure Insurance API is running 🚀'));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
