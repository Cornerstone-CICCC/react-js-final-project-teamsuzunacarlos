export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface Sock {
  _id?: string;
  id: string;
  userId: string;
  color: string;
  pattern: string;
  size: string;
  material: string;
  images: string[];
  description: string;
  status: "available" | "matched" | "traded";
  createdAt: string;
}

export interface PopulatedMatch {
  _id: string;
  sock1Id: Sock;
  sock2Id: Sock;
  user1Id: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  user2Id: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  status: "pending" | "accepted" | "rejected";
  matchedAt?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  matchId: string;
  messageText: string;
  createdAt: string;
}

export interface Conversation {
  matchId: string;
  otherUser: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  sockImage?: string;
  lastMessage?: string;
}
