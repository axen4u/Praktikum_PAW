const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Route utama
app.get('/', (req, res) => {
  res.json({ message: 'Home Page for API' });
});


// Import route books
const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
