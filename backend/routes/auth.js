const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
require('dotenv').config();

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user exists - use maybeSingle() to avoid error on no rows
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError) {
      console.error('Signup check error:', existingError);
      return res.status(500).json({ message: 'Error checking existing user' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login or use a different email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      console.error('Signup insert error:', error);
      if (error.message.includes('duplicate') || error.message.includes('Unique')) {
        return res.status(400).json({ message: 'Email already registered. Please login or use a different email.' });
      }
      return res.status(500).json({ message: 'Error creating user' });
    }

    // Generate token
    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      message: 'Account created successfully!', 
      token, 
      user: { id: data.id, email: data.email } 
    });
  } catch (err) {
    console.error('Signup catch error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Get user - use maybeSingle() instead of single() to handle no rows gracefully
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Login query error:', error);
      return res.status(500).json({ message: 'Error during login' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Login successful!', 
      token, 
      user: { id: user.id, email: user.email } 
    });
  } catch (err) {
    console.error('Login catch error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;