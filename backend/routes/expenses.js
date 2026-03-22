const express = require('express');
const supabase = require('../config/supabaseClient');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get expenses
router.get('/', async (req, res) => {
  const { month, category } = req.query;
  const userId = req.user.id;

  try {
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (month) {
      const startDate = `${month}-01`;
      const endDate = new Date(month.split('-')[0], month.split('-')[1], 0).toISOString().split('T')[0];
      query = query.gte('date', startDate).lte('date', endDate);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: 'Error fetching expenses', error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add expense
router.post('/', async (req, res) => {
  const { amount, description, category, date } = req.body;
  const userId = req.user.id;

  if (amount === undefined || !description || !category || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ user_id: userId, amount: numericAmount, description, category, date }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error adding expense', error });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;
  const userId = req.user.id;

  if (amount === undefined || !description || !category || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .update({ amount: numericAmount, description, category, date, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error updating expense', error });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ message: 'Error deleting expense', error });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;