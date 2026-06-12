# It Socks - Backend Guide

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Update these fields in `.env`:

- `MONGODB_URI`: MongoDB connection string (use MongoDB Atlas for cloud or local MongoDB)
- `JWT_SECRET`: A strong random secret for JWT tokens
- `FRONTEND_URL`: Frontend URL (default is http://localhost:5173)

Example for local MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/it-socks-db
JWT_SECRET=your_super_secret_key_here_change_this
```

### 3. Create Uploads Folder

The backend needs a folder for image uploads:

```bash
mkdir uploads
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## Testing the API

You can test the backend using **Postman**, **Thunder Client**, or **curl**.

### Authentication Endpoints

#### 1. Register a User

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "sockfinder",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

#### 2. Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

Response includes auth cookie automatically set.

#### 3. Get Current User

```
GET http://localhost:5000/api/auth/me
Cookie: token=<your_jwt_token>
```

#### 4. Logout

```
POST http://localhost:5000/api/auth/logout
```

---

### Sock Endpoints

#### 1. Get All Available Socks

```
GET http://localhost:5000/api/socks
```

Query parameters:

- `color`: Filter by color (e.g., ?color=red)
- `size`: Filter by size (small, medium, large)
- `pattern`: Filter by pattern
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

Example with filters:

```
GET http://localhost:5000/api/socks?color=blue&size=medium&page=1
```

#### 2. Get Single Sock

```
GET http://localhost:5000/api/socks/:id
```

#### 3. Create a Sock

```
POST http://localhost:5000/api/socks
Cookie: token=<your_jwt_token>
Content-Type: multipart/form-data

Fields:
- color: "red" (required)
- pattern: "striped"
- size: "medium"
- material: "cotton"
- description: "Favorite sock"
- images: <file1> <file2> (multiple files allowed)
```

#### 4. Update a Sock

```
PUT http://localhost:5000/api/socks/:id
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "color": "blue",
  "description": "Updated description"
}
```

#### 5. Delete a Sock

```
DELETE http://localhost:5000/api/socks/:id
Cookie: token=<your_jwt_token>
```

#### 6. Get Your Socks

```
GET http://localhost:5000/api/socks/my-socks
Cookie: token=<your_jwt_token>
```

---

### Match Endpoints

#### 1. Get Your Matches

```
GET http://localhost:5000/api/matches
Cookie: token=<your_jwt_token>
```

#### 2. Create a Match (Like/Swipe)

```
POST http://localhost:5000/api/matches
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "sock2Id": "other_sock_id_here"
}
```

#### 3. Accept a Match

```
PUT http://localhost:5000/api/matches/:matchId/accept
Cookie: token=<your_jwt_token>
```

#### 4. Reject a Match

```
PUT http://localhost:5000/api/matches/:matchId/reject
Cookie: token=<your_jwt_token>
```

#### 5. Unmatch

```
DELETE http://localhost:5000/api/matches/:matchId
Cookie: token=<your_jwt_token>
```

---

### Message Endpoints

#### 1. Get All Conversations

```
GET http://localhost:5000/api/messages/conversations
Cookie: token=<your_jwt_token>
```

#### 2. Get Messages for a Match

```
GET http://localhost:5000/api/messages/:matchId
Cookie: token=<your_jwt_token>
```

Query parameters:

- `page`: Page number (default: 1)
- `limit`: Messages per page (default: 50)

#### 3. Send a Message (HTTP)

```
POST http://localhost:5000/api/messages
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "matchId": "match_id_here",
  "messageText": "Hi! How are you?"
}
```

---

## Socket.IO Real-time Events

Socket.IO is used for real-time messaging. Connect with:

```javascript
const socket = io("http://localhost:5000", {
  auth: {
    token: "your_jwt_token",
  },
});
```

### Available Events

**Send Message (real-time):**

```javascript
socket.emit("send-message", {
  matchId: "match_id",
  messageText: "Hello!",
});
```

**Receive Message:**

```javascript
socket.on("receive-message", (data) => {
  console.log(data.messageText);
});
```

**Typing Indicator (send):**

```javascript
socket.emit("typing", {
  matchId: "match_id",
  isTyping: true,
});
```

**Typing Indicator (receive):**

```javascript
socket.on("user-typing", (data) => {
  console.log(`User ${data.userId} is typing: ${data.isTyping}`);
});
```

**Join Match Room:**

```javascript
socket.emit("join-match", "match_id");
```

**Leave Match Room:**

```javascript
socket.emit("leave-match", "match_id");
```

---

## Testing Flow (Step-by-Step)

### 1. Create Two Users

- Register User 1 (use Postman)
- Register User 2 (different email/username)

### 2. Create Socks

- User 1: Create sock (POST /api/socks)
- User 2: Create sock (POST /api/socks)

### 3. Test Discovery

- List all socks (GET /api/socks)
- Should see each other's socks

### 4. Test Matching

- User 1: Create match with User 2's sock (POST /api/matches)
- User 2: Get matches (GET /api/matches)
- User 2: Accept match (PUT /api/matches/:id/accept)

### 5. Test Messaging

- Both users: Get conversations (GET /api/messages/conversations)
- Send message via HTTP (POST /api/messages)
- Get conversation history (GET /api/messages/:matchId)

### 6. Test Socket.IO (Optional)

- Connect with Socket.IO
- Join a match room
- Send real-time messages
- See typing indicators

---

## Useful MongoDB Queries

Check your database in MongoDB Compass or Atlas:

**View all users:**

```
db.users.find({})
```

**View all socks:**

```
db.socks.find({})
```

**View all matches:**

```
db.matches.find({})
```

**View all messages:**

```
db.messages.find({})
```

---

## Troubleshooting

### "MONGODB_URI is not defined"

- Make sure `.env` file exists
- Check `MONGODB_URI` is set correctly
- If using MongoDB Atlas, copy the connection string from your cluster

### "Cannot connect to MongoDB"

- If using local: ensure MongoDB service is running
  - macOS: `brew services start mongodb-community`
  - Windows: MongoDB service should be running in Services
  - Linux: `sudo systemctl start mongodb`

### "Port 5000 already in use"

- Change PORT in `.env` to a different port (e.g., 5001)

### "CORS Error"

- Check `FRONTEND_URL` in `.env` matches your frontend URL
- Make sure credentials are allowed

### Image Upload Not Working

- Check `uploads` folder exists
- Check `IMAGE_MAX_SIZE` in `.env`
- Supported formats: JPEG, PNG, WebP

---

## API Response Format

All responses follow this format:

**Success (2xx):**

```json
{
  "message": "Success message",
  "data": { ...data },
  "user": { ...user },
  "socks": [ ...socks ]
}
```

**Error (4xx, 5xx):**

```json
{
  "message": "Error description"
}
```

---

## Production Deployment

Before deploying to Render/Vercel:

1. Update `JWT_SECRET` to a strong value
2. Set `NODE_ENV=production` in `.env`
3. Use MongoDB Atlas for database (not local)
4. Update `FRONTEND_URL` to production frontend URL
5. Ensure uploads folder is handled (Render/Vercel use ephemeral storage)

---

Good luck testing! 🧦
