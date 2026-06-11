// Messages/chat hub page
// Should include:
// - ConversationList on left side
// - ChatWindow on right side (or full screen on mobile)
// - Layout for conversations
// - Responsive design
// - Empty state when no conversations

import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { Conversation, Message } from "../types";
import { LiaSocksSolid } from "react-icons/lia";

export default function Messages() {
  const socket = useSocket();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // dummy conversation
  useEffect(() => {
    const dummyConversations: Conversation[] = [
      {
        matchId: "match_1",
        otherUser: {
          id: "userA",
          username: "Carlos",
          profilePicture:
            "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=100",
        },
      },
      {
        matchId: "match_2",
        otherUser: {
          id: "userB",
          username: "Diana",
          profilePicture:
            "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=100",
        },
      },
    ];
    setConversations(dummyConversations);
  }, []);

  // Socket room
  useEffect(() => {
    if (!activeMatchId) return;

    let dummyMessages: Message[] = [];

    if (activeMatchId === "match_1") {
      dummyMessages = [
        {
          id: "m1",
          senderId: "userA",
          receiverId: "current_user",
          matchId: "match_1",
          messageText: "Hi! Is your green holiday sock still lonely?",
          createdAt: "2026-06-09T12:00:00Z",
        },
        {
          id: "m2",
          senderId: "current_user",
          receiverId: "userA",
          matchId: "match_1",
          messageText: "Yes it is! I have been looking for it since Christmas!",
          createdAt: "2026-06-09T12:05:00Z",
        },
        {
          id: "m3",
          senderId: "userA",
          receiverId: "current_user",
          matchId: "match_1",
          messageText:
            "Awesome! My Red Striped sock would love to match with it.",
          createdAt: "2026-06-09T12:06:00Z",
        },
      ];
    } else if (activeMatchId === "match_2") {
      dummyMessages = [
        {
          id: "m4",
          senderId: "userB",
          receiverId: "current_user",
          matchId: "match_2",
          messageText:
            "Hello there! My Blue Polka Dot sock is looking for a soft partner.",
          createdAt: "2026-06-10T10:00:00Z",
        },
        {
          id: "m5",
          senderId: "current_user",
          receiverId: "userB",
          matchId: "match_2",
          messageText: "Mine is 100% wool, super warm!",
          createdAt: "2026-06-10T10:02:00Z",
        },
        {
          id: "m6",
          senderId: "userB",
          receiverId: "current_user",
          matchId: "match_2",
          messageText: "Sounds comfy. Is your sock size M or L?",
          createdAt: "2026-06-10T10:03:00Z",
        },
      ];
    }

    setMessages(dummyMessages);

    if (socket) {
      socket.emit("join_room", { matchId: activeMatchId });
    }

    if (socket) {
      socket.on("message:received", (newMessage: Message) => {
        if (newMessage.matchId === activeMatchId) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }

    return () => {
      if (socket) socket.off("message:received");
    };
  }, [activeMatchId, socket]);

  // Proccessing message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeMatchId) return;

    const currentUserId = user?.id || "current_user";
    const activeConv = conversations.find((c) => c.matchId === activeMatchId);

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: activeConv?.otherUser.id || "",
      matchId: activeMatchId,
      messageText: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    if (socket) {
      socket.emit("message:send", newMessage);
    }

    setText("");
  };

  const activeConversation = conversations.find(
    (c) => c.matchId === activeMatchId,
  );

  return (
    <div
      style={{
        display: "flex",
        maxWidth: "800px",
        margin: "40px auto",
        height: "500px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Left colum */}
      <div
        style={{
          width: "35%",
          borderRight: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
          overflowY: "auto",
        }}
      >
        <h3
          style={{ padding: "15px", margin: 0, borderBottom: "1px solid #eee" }}
        >
          Chats
        </h3>
        {conversations.map((conv) => (
          <div
            key={conv.matchId}
            onClick={() => setActiveMatchId(conv.matchId)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px",
              cursor: "pointer",
              backgroundColor:
                activeMatchId === conv.matchId ? "#e0f2fe" : "transparent",
              borderBottom: "1px solid #eee",
            }}
          >
            <img
              src={conv.otherUser.profilePicture} // ../backend/${user.images[number]}
              alt=""
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <div style={{ overflow: "hidden" }}>
              <h4 style={{ margin: 0, fontSize: "14px" }}>
                {conv.otherUser.username}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#666",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {conv.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* right colum */}
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        {activeMatchId && activeConversation ? (
          <>
            <div
              style={{
                padding: "15px",
                borderBottom: "1px solid #eee",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={activeConversation.otherUser.profilePicture}
                alt=""
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              {activeConversation.otherUser.username}
            </div>

            {/* message area */}
            <div
              style={{
                flexGrow: 1,
                padding: "15px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {messages.map((msg) => {
                const isMe = msg.senderId === (user?.id || "current_user");
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "15px",
                        fontSize: "14px",
                        backgroundColor: isMe ? "#0070f3" : "#e5e7eb",
                        color: isMe ? "#fff" : "#000",
                      }}
                    >
                      {msg.messageText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* message form */}
            <form
              onSubmit={handleSend}
              style={{
                padding: "15px",
                borderTop: "1px solid #eee",
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flexGrow: 1,
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#888",
            }}
          >
            Select a conversation to start chatting! <LiaSocksSolid />
          </div>
        )}
      </div>
    </div>
  );
}
