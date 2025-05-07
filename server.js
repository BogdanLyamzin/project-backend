const express = require('express');
const cors = require('cors');
require("dotenv/config");

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', authRoutes);

connectDB()
    .then(()=> {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });

