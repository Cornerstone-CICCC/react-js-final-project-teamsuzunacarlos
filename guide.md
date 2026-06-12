# Sock Dating App - Project Guide

## 📱 Project Overview

A full-stack dating application for lonely socks! When you lose a sock, upload it to your profile and search for its perfect match. When two socks match, a chat opens up between their owners to coordinate a reunion.

**Team:**

- **Carlos** - Backend Development
- **Suzuna** - Frontend Development

## 🏗️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Real-time Communication:** Socket.IO

## 📂 Project Structure

```
root/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── models/         # Mongoose schemas (User, Sock, Match, Message)
│   │   ├── routes/         # API endpoints (auth, socks, matches, messages)
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Express middleware (auth, validation, errors)
│   │   ├── services/       # External integrations (Socket.IO, image upload)
│   │   ├── config/         # Configuration (DB, env)
│   │   ├── utils/          # Utility functions (JWT, password hashing)
│   │   └── server.js       # Entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── frontend/               # React/Vite SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # Context providers (Auth, Socket)
│   │   ├── services/       # API & Socket service calls
│   │   ├── utils/          # Utility functions (validators, formatters)
│   │   ├── styles/         # Global CSS
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── vite.config.js      # Vite configuration
│
└── guide.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret

5. Start development server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## 🔑 Key Features

### MVP (Minimum Viable Product)

- ✅ User authentication (signup/login)
- ✅ Sock upload/creation
- ✅ Sock discovery/browsing
- ✅ Sock matching (like/swipe system)
- ✅ Real-time chat between matched socks
- ✅ User profiles with sock listings

### Future Enhancements

- Rating/review system
- Advanced filtering (size, material, pattern)
- Notifications
- Analytics dashboard

## 🔐 Authentication

- Password hashing: bcrypt
- JWT tokens stored in cookies
- Routes are protected based on user authentication
- Protected routes redirect to login if not authenticated

## 💾 Database Models

### User

- id, username, email, hashedPassword, profilePicture, bio, createdAt

### Sock

- id, userId (owner), color, pattern, size, material, images[], description, status, createdAt

### Match

- id, sock1Id, sock2Id, status (pending/accepted/rejected), createdAt, matchedAt

### Message

- id, senderId, receiverId, matchId, messageText, createdAt

## 🔌 API Endpoints (Backend)

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Socks

- `GET /api/socks` - Get all socks (with filters)
- `POST /api/socks` - Create new sock
- `GET /api/my-socks` - Get user's socks
- `PUT /api/socks/:id` - Update sock
- `DELETE /api/socks/:id` - Delete sock

### Matches

- `GET /api/matches` - Get user's matches
- `POST /api/matches` - Create match
- `PUT /api/matches/:id` - Accept/reject match
- `DELETE /api/matches/:id` - Unmatch

### Messages

- `GET /api/conversations` - Get all conversations
- `GET /api/messages/:matchId` - Get messages for a match
- Real-time messaging via Socket.IO

## 🎨 Frontend Routes

- `/` - Home/Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/discover` - Browse and swipe socks
- `/messages` - Chat hub
- `/profile` - User profile
- `/upload-sock` - Upload new sock

## 🔄 Real-time Communication (Socket.IO)

Events:

- `message:send` - Send a message
- `message:received` - Receive a message
- `typing:start` - User is typing
- `typing:stop` - User stopped typing
- `match:new` - New match notification
- `user:online` - User came online
- `user:offline` - User went offline

## 📝 Code Quality Tools

### Biome

All code must pass Biome checks (format & lint):

```bash
npm run lint      # Check
npm run format    # Auto-fix
```

### Husky

Git hooks run Biome before commits. Configure in `.husky/pre-commit`.

## ⚠️ Important Notes

- **Never commit `.env` files** - Use `.env.example` as template
- **Protect sensitive routes** - Only allow authenticated users to modify data
- **Validate all inputs** - Both frontend and backend
- **Use HTTPS in production**
- **Password strength validation** using zxcvbn
- **CORS enabled** between frontend (5173) and backend (5000)

## 🚢 Deployment

### Backend Options

- Render.com
- Railway
- Heroku (deprecated but possible)

### Frontend Options

- Vercel
- Netlify
- Render.com

## 📞 Communication

- Use GitHub Issues for bug reports
- Use GitHub Projects for task tracking
- Create branches following: `feature/`, `bugfix/`, `hotfix/` naming
- Keep commits atomic and descriptive

## ❓ Troubleshooting

**Backend won't connect to MongoDB:**

- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`

**Frontend can't reach backend:**

- Check backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend

**Socket.IO connection issues:**

- Ensure Socket.IO is initialized on backend
- Check `VITE_SOCKET_URL` in frontend

---

**Good luck with the project! 🎉**
