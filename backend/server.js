const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();
const basePort = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Serve static files from frontend directory
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'dashboard.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(frontendPath, 'signup.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

function startServer(port, retries = 0) {
  const maxRetries = 3;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Frontend path: ${frontendPath}`);
    console.log(`Visit http://localhost:${port} in your browser`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE' && retries < maxRetries) {
      console.warn(`Port ${port} is in use, trying ${port + 1}`);
      startServer(port + 1, retries + 1);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

startServer(basePort);
