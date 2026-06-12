# It Socks - Testing Guide

## Overview

This guide walks you through testing the full application flow with 2 users. You'll create accounts, upload socks, match them, and chat in real-time.

## Testing with Two Users

### Option 1: Two Postman Tabs (Easiest)

You **don't** need two Postman windows. Just use **tabs** in Postman and manage cookies/tokens for each user:

1. **Tab 1**: User 1 (Alice)
2. **Tab 2**: User 2 (Bob)

Each tab maintains its own cookies automatically.

### Option 2: Postman Environments (Advanced)

Create environments to store tokens for multiple users. See "Postman Environments" section below.

---

## Step-by-Step Testing

### STEP 1: Register User 1 (Alice)

**Tab 1 - New Request**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "alice_sock_lover",
  "email": "alice@example.com",
  "password": "AlicePassword123!",
  "confirmPassword": "AlicePassword123!"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "USER_1_ID",
    "email": "alice@example.com",
    "username": "alice_sock_lover"
  }
}
```

✅ Cookie `token` is automatically set in Tab 1

---

### STEP 2: Register User 2 (Bob)

**Tab 2 - New Request** (same endpoint, different data)
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "bob_sock_seeker",
  "email": "bob@example.com",
  "password": "BobPassword123!",
  "confirmPassword": "BobPassword123!"
}
```

✅ Cookie `token` is automatically set in Tab 2 for Bob

---

### STEP 3: Create Sock for Alice

**Tab 1 - New Request**
```
POST http://localhost:5000/api/socks
Cookie: (automatically included from login)
Content-Type: multipart/form-data

Form Data:
- color: "red"
- pattern: "striped"
- size: "medium"
- material: "cotton"
- description: "My favorite red striped sock"
- images: <select an image file>
```

**Response:**
```json
{
  "message": "Sock created successfully",
  "sock": {
    "id": "SOCK_1_ID",
    "userId": "USER_1_ID",
    "color": "red",
    "status": "available",
    ...
  }
}
```

Save `SOCK_1_ID` for later.

---

### STEP 4: Create Sock for Bob

**Tab 2 - New Request**
```
POST http://localhost:5000/api/socks
Content-Type: multipart/form-data

Form Data:
- color: "blue"
- pattern: "solid"
- size: "medium"
- material: "wool"
- description: "A cozy blue wool sock"
- images: <select an image file>
```

Save `SOCK_2_ID`.

---

### STEP 5: Get Available Socks (Browse)

**Tab 1 - View all socks**
```
GET http://localhost:5000/api/socks
```

Should return Bob's sock (and any others).

**Tab 2 - View all socks**
```
GET http://localhost:5000/api/socks
```

Should return Alice's sock.

---

### STEP 6: Create a Match (Alice likes Bob's sock)

**Tab 1 - Alice swipes on Bob's sock**
```
POST http://localhost:5000/api/matches
Content-Type: application/json

{
  "sock2Id": "SOCK_2_ID"
}
```

**Response:**
```json
{
  "message": "Match created successfully",
  "match": {
    "id": "MATCH_ID",
    "sock1Id": "SOCK_1_ID",
    "sock2Id": "SOCK_2_ID",
    "user1Id": "USER_1_ID",
    "user2Id": "USER_2_ID",
    "status": "pending",
    ...
  }
}
```

Save `MATCH_ID`.

---

### STEP 7: Check Matches

**Tab 1 - Alice's matches**
```
GET http://localhost:5000/api/matches
```

Should show the pending match with Bob.

**Tab 2 - Bob's matches**
```
GET http://localhost:5000/api/matches
```

Should show Alice's pending match.

---

### STEP 8: Accept Match (Bob accepts)

**Tab 2 - Bob accepts match**
```
PUT http://localhost:5000/api/matches/MATCH_ID/accept
```

**Response:**
```json
{
  "message": "Match accepted",
  "match": {
    ...
    "status": "accepted",
    "matchedAt": "2024-06-10T12:00:00Z"
  }
}
```

---

### STEP 9: Get Conversations

**Tab 1 - Alice gets conversations**
```
GET http://localhost:5000/api/messages/conversations
```

Should show her conversation with Bob.

**Tab 2 - Bob gets conversations**
```
GET http://localhost:5000/api/messages/conversations
```

Should show his conversation with Alice.

---

### STEP 10: Send a Message (HTTP)

**Tab 1 - Alice sends message**
```
POST http://localhost:5000/api/messages
Content-Type: application/json

{
  "matchId": "MATCH_ID",
  "messageText": "Hi Bob! Found your sock! 🧦"
}
```

**Response:**
```json
{
  "message": "Message sent",
  "data": {
    "id": "MESSAGE_ID",
    "senderId": "USER_1_ID",
    "messageText": "Hi Bob! Found your sock! 🧦",
    "createdAt": "2024-06-10T12:05:00Z"
  }
}
```

---

### STEP 11: Get Conversation History

**Tab 2 - Bob retrieves messages**
```
GET http://localhost:5000/api/messages/MATCH_ID
```

Should show Alice's message.

**Tab 1 - Alice retrieves messages**
```
GET http://localhost:5000/api/messages/MATCH_ID
```

Should show her own message.

---

### STEP 12: Real-time Chat with Socket.IO (Optional)

To test real-time messaging, you need a Socket.IO client. Use **Thunder Client** or **curl** with WebSocket support:

**Connection:**
```javascript
const io = require('socket.io-client');

const socket1 = io('http://localhost:5000', {
  auth: { token: 'ALICE_TOKEN' }
});

const socket2 = io('http://localhost:5000', {
  auth: { token: 'BOB_TOKEN' }
});

// Alice joins match room
socket1.emit('join-match', 'MATCH_ID');

// Bob joins match room
socket2.emit('join-match', 'MATCH_ID');

// Alice sends real-time message
socket1.emit('send-message', {
  matchId: 'MATCH_ID',
  messageText: 'Real-time hi!'
});

// Bob receives it
socket2.on('receive-message', (data) => {
  console.log('Bob received:', data.messageText);
});
```

Or test with a tool like **Insomnia** which has WebSocket support.

---

## Complete Test Flow Checklist

- [ ] Register Alice
- [ ] Register Bob
- [ ] Alice creates sock (red striped)
- [ ] Bob creates sock (blue solid)
- [ ] Alice views socks (sees Bob's)
- [ ] Bob views socks (sees Alice's)
- [ ] Alice creates match with Bob's sock
- [ ] Check Alice's matches (shows pending)
- [ ] Check Bob's matches (shows pending)
- [ ] Bob accepts match
- [ ] Alice gets conversations (sees Bob)
- [ ] Bob gets conversations (sees Alice)
- [ ] Alice sends message
- [ ] Bob retrieves messages (sees Alice's)
- [ ] Bob sends message
- [ ] Alice retrieves messages (sees Bob's)

---

## Using Postman Environment Variables

To easily manage two users without constantly copying IDs:

### Create Environment

1. Click **Environments** → **New**
2. Name: `It Socks Test`
3. Add variables:

```
ALICE_USER_ID: <leave empty, will be auto-filled>
ALICE_SOCK_ID: <leave empty>
BOB_USER_ID: <leave empty>
BOB_SOCK_ID: <leave empty>
MATCH_ID: <leave empty>
BASE_URL: http://localhost:5000
```

### Save Response to Variable

After registering Alice, in the **Tests** tab:
```javascript
if (pm.response.code === 201) {
  pm.environment.set('ALICE_USER_ID', pm.response.json().user.id);
}
```

Same for Bob, socks, and match ID.

### Use Variables in Requests

Instead of hardcoding IDs:
```json
{
  "sock2Id": "{{BOB_SOCK_ID}}"
}
```

---

## Troubleshooting Tests

### "Not authorized to access this route"
- Cookie not set. Check Postman has cookies enabled
- Tab doesn't have authentication context
- Token might be expired

### "User already exists"
- Use different usernames/emails for each test run
- Or test with new user each time

### "Cannot match with your own sock"
- Make sure you're using the OTHER user's sock ID
- Check sock ownership

### "Socket.IO connection error"
- Backend not running
- Check `FRONTEND_URL` in backend `.env`
- Token auth might be failing

### Socks not visible when browsing
- Socks must have `status: "available"`
- Check sock's userId isn't excluded from search

---

## Testing Best Practices

1. **Use meaningful usernames**: alice_sock_lover, bob_sock_seeker
2. **Save IDs**: Copy response IDs to notepad or use Postman variables
3. **Test in order**: Don't skip steps (e.g., can't match without creating socks)
4. **Use different images**: Makes testing easier to track
5. **Check status codes**: 201 Created, 200 OK, 400 Bad Request, 401 Unauthorized

---

## Common Test Scenarios

### Scenario 1: Rejected Match
```
PUT http://localhost:5000/api/matches/MATCH_ID/reject
```
Then check status is "rejected".

### Scenario 2: Unmatch
```
DELETE http://localhost:5000/api/matches/MATCH_ID
```
Socks should return to "available".

### Scenario 3: Multiple Matches
1. Alice creates 2 socks
2. Bob creates 2 socks
3. Create 4 different matches
4. Check matches list for both users

### Scenario 4: Message Pagination
```
GET http://localhost:5000/api/messages/MATCH_ID?page=1&limit=10
```

---

## Notes

- All endpoints require authentication cookies (except /register and /login)
- Postman automatically handles cookies per tab
- File uploads require `multipart/form-data` content type
- Dates in responses are ISO 8601 format
- Match status: "pending" → "accepted" or "rejected"
- Sock status: "available" → "matched" → "available" (if unmatched)

Good luck testing! 🧦
