<<<<<<< HEAD
# 💰 Monthly Expense Tracker

A full-stack web application for tracking monthly expenses with user authentication, built with Node.js Express backend and vanilla JavaScript frontend.

## ✨ Features

- 👤 User registration and login with JWT authentication
- 💳 Add, view, edit, and delete expenses
- 📊 Filter expenses by month and category
- 💵 Real-time monthly expense totals
- 🎨 Responsive, modern UI design
- 📱 Mobile-friendly interface
- 🔒 Secure password hashing with bcrypt
- ⏱️ 24-hour JWT token expiration

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js with Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT tokens with bcrypt password hashing
- **API:** RESTful architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Supabase account and project
- A modern web browser

## 🚀 Quick Start

### 1. Clone or Extract the Project

Ensure you have the project files in your workspace.

### 2. Set Up Supabase Database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to the **SQL Editor** section
3. Create a new query and run the following SQL:

```sql
-- Create users table
y

4. Get your Supabase credentials:
   - Go to **Project Settings** → **API**
   - Copy your **Project URL** (SUPABASE_URL)
   - Copy your **anon** key (SUPABASE_ANON_KEY)

### 3. Configure Environment Variables

Update the `.env` file in the root directory:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-secure-random-string-here
PORT=3000
```

> Tip: For local development and complete API behavior, include `SUPABASE_SERVICE_ROLE_KEY`. In production, keep this key secret and store it in secure environment settings.

**Important:** Replace placeholder values with your actual Supabase credentials. The SUPABASE_URL must start with `https://`.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

**Development mode** (with auto-refresh):
```bash
npm run dev
```

**Production mode**:
```bash
node backend/server.js
```

The application will be available at:
```
http://localhost:3000
```

### 6. Vercel Deployment

1. Create a Vercel account and connect your repository.
2. Add environment variables in Vercel Dashboard:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY (if needed)
   - SUPABASE_SERVICE_ROLE_KEY (recommended)
   - JWT_SECRET
3. `vercel.json` routes front-end and `/api` serverless endpoints.
4. Push to `main` and deploy.

Access app at:
```
https://<your-vercel-project>.vercel.app
```

### 6. Access the App

1. Open your browser and visit `http://localhost:3000`
2. Click **Sign Up** to create a new account
3. Log in with your credentials
4. Start adding and managing your expenses

## 📁 Project Structure

```
expense-tracker-backend/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── expenses.js          # Expense CRUD endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   └── config/
│       └── supabaseClient.js    # Supabase client configuration
├── frontend/
│   ├── index.html               # Home page
│   ├── login.html               # Login page
│   ├── signup.html              # Sign up page
│   ├── dashboard.html           # Expense dashboard
│   ├── css/
│   │   └── styles.css           # Responsive CSS styling
│   └── js/
│       ├── auth.js              # Authentication logic
│       └── expenses.js          # Expense management logic
├── .env                         # Environment variables (create this)
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication

**Sign Up**
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Expenses (All require `Authorization: Bearer <token>` header)

**Get All Expenses**
```
GET /api/expenses?month=2026-03&category=Food
```

**Add Expense**
```
POST /api/expenses
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 50.00,
  "description": "Lunch",
  "category": "Food",
  "date": "2026-03-22"
}
```

**Update Expense**
```
PUT /api/expenses/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 60.00,
  "description": "Lunch and coffee",
  "category": "Food",
  "date": "2026-03-22"
}
```

**Delete Expense**
```
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

## 🏷️ Categories

The application supports the following expense categories:

- 🍽️ **Food** - Meals, groceries, restaurants
- 🚗 **Transport** - Gas, public transit, taxi
- 📄 **Bills** - Utilities, subscription, rent
- 🎬 **Entertainment** - Movies, games, hobbies
- 📦 **Other** - Miscellaneous expenses

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 24-hour expiration
- ✅ CORS enabled for safe cross-origin requests
- ✅ Input validation on all endpoints
- ✅ User data isolation (users can only access their own expenses)
- ✅ SQL injection protection via Supabase

## 🐛 Troubleshooting

### "Connected refused" error
- Ensure the server is running: `npm run dev`
- Check that port 3000 is not in use by another application
- On Windows, try: `netstat -ano | findstr :3000`

### "Invalid SUPABASE_URL" error
- Check your `.env` file
- Ensure SUPABASE_URL starts with `https://`
- Verify you copied the correct URL from Supabase Project Settings

### "Forbidden" or CORS errors
- Ensure you're using absolute paths (starting with `/`) in HTML files
- Check that the backend server is running
- Clear browser cache (Ctrl+Shift+Del)

### Login/Signup not working
- Verify your Supabase database tables were created correctly
- Check the backend console for error messages
- Ensure your JWT_SECRET is set in `.env`

## 📱 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Deploy to Vercel (Frontend) + Supabase (Backend)

1. Push code to GitHub
2. Create Vercel account and connect your repository
3. Add environment variables in Vercel settings
4. Deploy!

### Deploy to Heroku (Full Stack)

```bash
heroku create
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_ANON_KEY=...
heroku config:set JWT_SECRET=...
git push heroku main
```

## 📝 Development Notes

### Adding New Features

1. Create API endpoints in `backend/routes/*.js`
2. Update frontend event listeners in `frontend/js/*.js`
3. Add UI elements in `frontend/*.html`
4. Test with `npm run dev`

### Database Migrations

To modify the database schema:
1. Go to Supabase SQL Editor
2. Write and test your migration
3. Document changes in `README.md`

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a learning project for full-stack web development.

## 🤝 Contributing

Feel free to fork, modify, and improve this project. Submit pull requests with new features or bug fixes!

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Express.js documentation: https://expressjs.com

---

=======
# 💰 Monthly Expense Tracker

A full-stack web application for tracking monthly expenses with user authentication, built with Node.js Express backend and vanilla JavaScript frontend.

## ✨ Features

- 👤 User registration and login with JWT authentication
- 💳 Add, view, edit, and delete expenses
- 📊 Filter expenses by month and category
- 💵 Real-time monthly expense totals
- 🎨 Responsive, modern UI design
- 📱 Mobile-friendly interface
- 🔒 Secure password hashing with bcrypt
- ⏱️ 24-hour JWT token expiration

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js with Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT tokens with bcrypt password hashing
- **API:** RESTful architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Supabase account and project
- A modern web browser

## 🚀 Quick Start

### 1. Clone or Extract the Project

Ensure you have the project files in your workspace.

### 2. Set Up Supabase Database

1. Create a new project in [Supabase](https://supabase.com)
2. Go to the **SQL Editor** section
3. Create a new query and run the following SQL:

```sql
-- Create users table
y

4. Get your Supabase credentials:
   - Go to **Project Settings** → **API**
   - Copy your **Project URL** (SUPABASE_URL)
   - Copy your **anon** key (SUPABASE_ANON_KEY)

### 3. Configure Environment Variables

Update the `.env` file in the root directory:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-secure-random-string-here
PORT=3000
```

> Tip: For local development and complete API behavior, include `SUPABASE_SERVICE_ROLE_KEY`. In production, keep this key secret and store it in secure environment settings.

**Important:** Replace placeholder values with your actual Supabase credentials. The SUPABASE_URL must start with `https://`.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

**Development mode** (with auto-refresh):
```bash
npm run dev
```

**Production mode**:
```bash
node backend/server.js
```

The application will be available at:
```
http://localhost:3000
```

### 6. Vercel Deployment

1. Create a Vercel account and connect your repository.
2. Add environment variables in Vercel Dashboard:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY (if needed)
   - SUPABASE_SERVICE_ROLE_KEY (recommended)
   - JWT_SECRET
3. `vercel.json` routes front-end and `/api` serverless endpoints.
4. Push to `main` and deploy.

Access app at:
```
https://<your-vercel-project>.vercel.app
```

### 6. Access the App

1. Open your browser and visit `http://localhost:3000`
2. Click **Sign Up** to create a new account
3. Log in with your credentials
4. Start adding and managing your expenses

## 📁 Project Structure

```
expense-tracker-backend/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   └── expenses.js          # Expense CRUD endpoints
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   └── config/
│       └── supabaseClient.js    # Supabase client configuration
├── frontend/
│   ├── index.html               # Home page
│   ├── login.html               # Login page
│   ├── signup.html              # Sign up page
│   ├── dashboard.html           # Expense dashboard
│   ├── css/
│   │   └── styles.css           # Responsive CSS styling
│   └── js/
│       ├── auth.js              # Authentication logic
│       └── expenses.js          # Expense management logic
├── .env                         # Environment variables (create this)
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication

**Sign Up**
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Expenses (All require `Authorization: Bearer <token>` header)

**Get All Expenses**
```
GET /api/expenses?month=2026-03&category=Food
```

**Add Expense**
```
POST /api/expenses
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 50.00,
  "description": "Lunch",
  "category": "Food",
  "date": "2026-03-22"
}
```

**Update Expense**
```
PUT /api/expenses/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 60.00,
  "description": "Lunch and coffee",
  "category": "Food",
  "date": "2026-03-22"
}
```

**Delete Expense**
```
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

## 🏷️ Categories

The application supports the following expense categories:

- 🍽️ **Food** - Meals, groceries, restaurants
- 🚗 **Transport** - Gas, public transit, taxi
- 📄 **Bills** - Utilities, subscription, rent
- 🎬 **Entertainment** - Movies, games, hobbies
- 📦 **Other** - Miscellaneous expenses

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 24-hour expiration
- ✅ CORS enabled for safe cross-origin requests
- ✅ Input validation on all endpoints
- ✅ User data isolation (users can only access their own expenses)
- ✅ SQL injection protection via Supabase

## 🐛 Troubleshooting

### "Connected refused" error
- Ensure the server is running: `npm run dev`
- Check that port 3000 is not in use by another application
- On Windows, try: `netstat -ano | findstr :3000`

### "Invalid SUPABASE_URL" error
- Check your `.env` file
- Ensure SUPABASE_URL starts with `https://`
- Verify you copied the correct URL from Supabase Project Settings

### "Forbidden" or CORS errors
- Ensure you're using absolute paths (starting with `/`) in HTML files
- Check that the backend server is running
- Clear browser cache (Ctrl+Shift+Del)

### Login/Signup not working
- Verify your Supabase database tables were created correctly
- Check the backend console for error messages
- Ensure your JWT_SECRET is set in `.env`

## 📱 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Deploy to Vercel (Frontend) + Supabase (Backend)

1. Push code to GitHub
2. Create Vercel account and connect your repository
3. Add environment variables in Vercel settings
4. Deploy!

### Deploy to Heroku (Full Stack)

```bash
heroku create
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_ANON_KEY=...
heroku config:set JWT_SECRET=...
git push heroku main
```

## 📝 Development Notes

### Adding New Features

1. Create API endpoints in `backend/routes/*.js`
2. Update frontend event listeners in `frontend/js/*.js`
3. Add UI elements in `frontend/*.html`
4. Test with `npm run dev`

### Database Migrations

To modify the database schema:
1. Go to Supabase SQL Editor
2. Write and test your migration
3. Document changes in `README.md`

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a learning project for full-stack web development.

## 🤝 Contributing

Feel free to fork, modify, and improve this project. Submit pull requests with new features or bug fixes!

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Express.js documentation: https://expressjs.com

---

>>>>>>> 053ca3523703aa6532ba668af6e415667c3ad586
**Made with ❤️ - Happy Expense Tracking!**