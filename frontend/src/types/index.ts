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
  id: string;
  userId: string;
  color: string;
  pattern: string;
  size: string;
  material: string;
  images: string[];
  description: string;
  status: "lonely" | "matched";
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
  lastMessage?: string;
}
