const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Force load .env from root and override any existing env variable values.
const envPath = path.resolve(__dirname, '../../.env');
const dotenv = require('dotenv').config({ path: envPath, override: true });
if (dotenv.error) {
  console.warn('Warning: could not load .env from', envPath, dotenv.error);
}

let supabaseUrl = (process.env.SUPABASE_URL || '').toString().trim();
let supabaseKey = '';

// Use service role key if available to bypass row-level security for backend operations.
if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('your_')) {
  supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY.toString().trim();
  console.log('Using SUPABASE_SERVICE_ROLE_KEY for backend operations');
} else {
  supabaseKey = (process.env.SUPABASE_ANON_KEY || '').toString().trim();
}

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(`Invalid SUPABASE_URL: '${supabaseUrl}'. Set SUPABASE_URL in .env to your project URL starting with https://`);
}

if (!supabaseKey || supabaseKey.startsWith('your_') || supabaseKey.toLowerCase().includes('your_supabase')) {
  throw new Error('Invalid Supabase key; replace placeholder in .env with your actual Supabase key (preferably service role key for backend).');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;