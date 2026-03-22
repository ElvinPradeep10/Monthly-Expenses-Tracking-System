const supabase = require('./config/supabaseClient');
const { verifyAuthToken, applyCors } = require('./utils/auth');

function parseMonthDateRange(monthString) {
  const [year, month] = monthString.split('-').map(Number);
  if (!year || !month) return null;
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = new Date(year, month, 0).toISOString().split('T')[0];
  return { start, end };
}

module.exports = async (req, res) => {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authUser = verifyAuthToken(req, res);
  if (!authUser) return;

  const userId = authUser.id;

  if (req.method === 'GET' && req.url.startsWith('/api/expenses')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const month = url.searchParams.get('month');
    const category = url.searchParams.get('category');

    let query = supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false });

    if (month) {
      const range = parseMonthDateRange(month);
      if (range) query = query.gte('date', range.start).lte('date', range.end);
    }

    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: 'Error fetching expenses', error });
    return res.json(data);
  }

  if (req.method === 'POST' && req.url === '/api/expenses') {
    const { amount, description, category, date } = req.body;
    if (!amount || !description || !category || !date) return res.status(400).json({ message: 'All fields are required' });

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return res.status(400).json({ message: 'Amount must be a positive number' });

    const { data, error } = await supabase.from('expenses').insert([{ user_id: userId, amount: numericAmount, description, category, date }]).select().single();
    if (error) return res.status(500).json({ message: 'Error adding expense', error });
    return res.status(201).json(data);
  }

  if ((req.method === 'PUT' || req.method === 'DELETE') && req.url.startsWith('/api/expenses/')) {
    const id = req.url.split('/').pop();
    if (!id) return res.status(400).json({ message: 'Expense ID required' });

    if (req.method === 'PUT') {
      const { amount, description, category, date } = req.body;
      if (!amount || !description || !category || !date) return res.status(400).json({ message: 'All fields are required' });

      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) return res.status(400).json({ message: 'Amount must be a positive number' });

      const { data, error } = await supabase.from('expenses').update({ amount: numericAmount, description, category, date, updated_at: new Date() }).eq('id', id).eq('user_id', userId).select().single();
      if (error) return res.status(500).json({ message: 'Error updating expense', error });
      return res.json(data);
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', userId);
      if (error) return res.status(500).json({ message: 'Error deleting expense', error });
      return res.json({ message: 'Expense deleted' });
    }
  }

  return res.status(404).json({ message: 'Route not found' });
};
