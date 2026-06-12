# Frontend-Backend Integration Checklist

## ✅ Setup Complete

### Backend (.env)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret>
JWT_EXPIRE=7d
IMAGE_MAX_SIZE=5242880
IMAGE_UPLOAD_DIR=./uploads
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🧪 Integration Tests

### 1. **Authentication Flow**

- [ ] Register user on frontend → Check user in MongoDB
- [ ] Login returns cookie with token
- [ ] GET `/api/auth/me` works (frontend can read user)
- [ ] Logout clears token

**Test in frontend:**

```
Open DevTools → Application → Cookies
Should see "token" with JWT value after login
```

### 2. **API Calls (CORS + Credentials)**

- [ ] Frontend can POST to `/api/socks`
- [ ] Frontend can GET `/api/socks`
- [ ] Frontend receives authenticated user's data
- [ ] No CORS errors in browser console

**Test:**
Open DevTools → Network → try creating a sock
Should see 201 response, not 403

### 3. **Socket.IO Real-time**

- [ ] Socket connects after login
- [ ] Socket disconnects after logout
- [ ] Can emit `join-match` event
- [ ] Can receive `receive-message` event

**Test in browser console (when logged in):**

```javascript
// If Socket.IO connected properly:
// Check Network tab → WS
// Should see WebSocket connection to localhost:5000
```

### 4. **Protected Routes**

- [ ] `/discover` redirects to `/login` if not authenticated
- [ ] `/messages` redirects to `/login` if not authenticated
- [ ] `/profile` redirects to `/login` if not authenticated
- [ ] `/upload-sock` redirects to `/login` if not authenticated

**Test:**

- Logout
- Try accessing `/discover` manually
- Should redirect to `/login`

### 5. **Cookie Handling**

- [ ] Backend sends HttpOnly cookie on login
- [ ] Frontend automatically includes cookie in all requests
- [ ] Cookie persists across page refreshes
- [ ] Cookie deleted on logout

**Test in DevTools:**

```
Storage → Cookies → localhost:5000
After login: should have "token" cookie
After logout: "token" should be gone
```

---

## 🔌 Connection Points

### Frontend → Backend

```
Frontend (5173)
  ├─ HTTP/Fetch → Backend (5000/api)
  ├─ Cookies (auto-included with credentials: true)
  └─ WebSocket (Socket.IO) → Backend (5000)
```

### Key Files

**Frontend:**

- `src/services/api.ts` - API calls (HTTP)
- `src/context/SocketContext.tsx` - Real-time connection
- `src/context/AuthContext.tsx` - Auth state
- `.env` - Configuration

**Backend:**

- `src/server.js` - Main server
- `src/services/socketService.js` - Socket.IO setup
- `src/middleware/auth.js` - Cookie/JWT validation
- `.env` - Configuration

---

## 🚨 Common Issues

### Issue: "CORS Error" or "403 Unauthorized"

**Solution:**

- Check backend `.env` `FRONTEND_URL=http://localhost:5173`
- Check backend `cors()` config in server.js
- Verify credentials: true is set in both api.ts fetch and Socket.IO

### Issue: Socket.IO won't connect

**Solution:**

- Make sure backend is running: `npm run dev` in backend folder
- Check `VITE_SOCKET_URL` in frontend `.env`
- Open DevTools → Network → look for WebSocket connection
- Token must be passed in Socket.IO auth

### Issue: Login works but not authenticated after refresh

**Solution:**

- Cookie might not be persistent
- Check if HttpOnly flag is set on backend
- Verify `credentials: "include"` in fetch calls

### Issue: Routes show "Loading" forever

**Solution:**

- AuthContext's `getMe()` might be failing
- Check network requests in DevTools
- Verify backend `/api/auth/me` endpoint works

---

## 📝 Running the Full Stack

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Should see: "Server running on port 5000"
# Should see: "MongoDB connected successfully"
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Should see: "VITE v... ready in ... ms"
# Open http://localhost:5173
```

---

## ✨ Full Flow Test

1. **Start both servers** (see above)
2. **Go to frontend:** http://localhost:5173
3. **Register**: Fill form on `/signup`
4. **Check MongoDB**: Should have new user
5. **Check cookies**: DevTools → Cookies → "token" should exist
6. **Verify Socket**: DevTools → Network → WS should connect
7. **Create sock**: `/upload-sock` → POST request should work
8. **Browse socks**: `/discover` → should see socks
9. **Send message**: `/messages` → real-time should work
10. **Logout**: Cookie should be cleared

---

If all tests pass ✅ — Integration is complete!
