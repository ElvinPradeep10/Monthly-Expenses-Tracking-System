const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('./config/supabaseClient');
const { applyCors } = require('./utils/auth');

module.exports = async (req, res) => {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};

  if (req.method === 'POST' && req.url === '/api/auth/signup') {
    const { email, password } = body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const { data: existingUser, error: existingError } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (existingError) return res.status(500).json({ message: 'Error checking existing user' });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').insert([{ email, password: hashed }]).select().single();
    if (error) return res.status(500).json({ message: 'Error creating user' });

    const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(201).json({ token, user: { id: data.id, email: data.email } });
  }

  if (req.method === 'POST' && req.url === '/api/auth/login') {
    const { email, password } = body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) return res.status(500).json({ message: 'Error during login' });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: user.id, email: user.email } });
  }

  return res.status(404).json({ message: 'Not found' });
};
