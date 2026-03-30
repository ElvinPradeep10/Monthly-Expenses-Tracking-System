// auth.js - Authentication handler

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Check if user is logged in on dashboard
  if (document.getElementById('expenseForm')) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must log in first');
      window.location.href = '/login.html';
    }
  }
});

async function handleSignup(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (email === '' || password === '' || confirmPassword === '') {
    alert('Please fill in all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Account created successfully! Please log in.');
      window.location.href = '/login.html';
    } else {
      alert(`Signup failed: ${data.message || 'Please try again'}`);
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Network error. Please check your connection and try again.');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (email === '' || password === '') {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = '/dashboard.html';
    } else {
      alert(`Login failed: ${data.message || 'Invalid credentials'}`);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Network error. Please check your connection and try again.');
  }
}
