const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const app = express();

// Initialize Supabase client
let supabase = null;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Warning: Supabase credentials not configured. Some features may not work.');
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility function
function parseMonthDateRange(monthString) {
  try {
    const [year, month] = monthString.split('-').map(Number);
    if (!year || !month || month < 1 || month > 12) return null;
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0);
    const end = endDate.toISOString().split('T')[0];
    return { start, end };
  } catch (e) {
    return null;
  }
}

// API Routes
app.get('/api/expenses', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ message: 'Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.' });
  }

  try {
    const month = req.query.month;
    const category = req.query.category;

    let query = supabase.from('expenses').select('*').order('date', { ascending: false });

    if (month && month.match(/^\d{4}-\d{2}$/)) {
      const range = parseMonthDateRange(month);
      if (range) query = query.gte('date', range.start).lte('date', range.end);
    }

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) {
      console.error('Expenses fetch error:', error);
      return res.status(500).json({ message: 'Error fetching expenses', error: error.message });
    }
    return res.json(data || []);
  } catch (err) {
    console.error('Expenses route error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ message: 'Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.' });
  }

  try {
    const { amount, description, category, date } = req.body;
    
    if (amount === undefined || !description || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ amount: numericAmount, description, category, date }])
      .select()
      .single();

    if (error) {
      console.error('Expense insert error:', error);
      return res.status(500).json({ message: 'Error adding expense', error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('Add expense route error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.put('/api/expenses/:id', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ message: 'Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.' });
  }

  try {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;
    
    if (!amount || !description || !category || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const { data, error } = await supabase
      .from('expenses')
      .update({ amount: numericAmount, description, category, date, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Expense update error:', error);
      return res.status(500).json({ message: 'Error updating expense', error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Update expense route error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ message: 'Supabase client not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.' });
  }

  try {
    const { id } = req.params;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    
    if (error) {
      console.error('Expense delete error:', error);
      return res.status(500).json({ message: 'Error deleting expense', error: error.message });
    }

    return res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Delete expense route error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const token = jwt.sign({ email, id: Date.now() }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });

    return res.status(201).json({ message: 'Account created successfully', token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const token = jwt.sign({ email, id: Date.now() }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });

    return res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Serve static files from frontend directory
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Serve HTML pages
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Export for Vercel
module.exports = app;
