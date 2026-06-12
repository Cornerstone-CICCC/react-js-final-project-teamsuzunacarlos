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
import { getImageUrl } from "../services/api";

export default function Messages() {
  const socket = useSocket();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  // Load conversations from the API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/conversations', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        // _id is always present; user.id is only set after login (not after getMe refresh)
        const userId = (user as any)?._id || user?.id;
        const convs: Conversation[] = (data || []).map((item: any) => {
          const match = item.match;
          const u1 = match.user1Id;
          const u2 = match.user2Id;
          const isU1 = u1._id === userId;
          const otherUser = isU1 ? u2 : u1;
          // sock1Id belongs to user1, sock2Id belongs to user2
          const otherSock = isU1 ? match.sock2Id : match.sock1Id;
          return {
            matchId: match._id,
            otherUser: {
              id: otherUser._id || otherUser.id,
              username: otherUser.username,
              profilePicture: otherUser.profilePicture,
            },
            sockImage: otherSock?.images?.[0],
            lastMessage: item.lastMessage?.messageText,
          };
        });
        setConversations(convs);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };
    fetchConversations();

    // // dummy conversation
    // const dummyConversations: Conversation[] = [
    //   {
    //     matchId: "match_1",
    //     otherUser: {
    //       id: "userA",
    //       username: "Carlos",
    //       profilePicture:
    //         "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=100",
    //     },
    //   },
    //   {
    //     matchId: "match_2",
    //     otherUser: {
    //       id: "userB",
    //       username: "Diana",
    //       profilePicture:
    //         "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=100",
    //     },
    //   },
    // ];
    // setConversations(dummyConversations);
  }, [user?.id]);

  // Load messages from API and set up socket room when a conversation is selected
  useEffect(() => {
    if (!activeMatchId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${activeMatchId}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        const msgs: Message[] = (data.messages || []).map((msg: any) => ({
          id: msg._id,
          senderId: msg.senderId?._id || msg.senderId,
          receiverId: msg.receiverId?._id || msg.receiverId,
          matchId: msg.matchId,
          messageText: msg.messageText,
          createdAt: msg.createdAt,
        }));
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();

    // // dummy messages
    // const dummyMessages: Message[] = [ ... ];
    // setMessages(dummyMessages);

    if (socket) {
      // Backend room name is "match-{matchId}", joined via "join-match" event
      socket.emit("join-match", activeMatchId);
      socket.on("receive-message", (newMessage: Message) => {
        if (newMessage.matchId === activeMatchId) {
          setMessages((prev) => {
            // Avoid duplicate if server echoes back our own sent message
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      });
    }

    return () => {
      if (socket) {
        socket.emit("leave-match", activeMatchId);
        socket.off("receive-message");
      }
    };
  }, [activeMatchId, socket]);

  // Send message — saves to DB via REST API and emits via socket for real-time delivery
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeMatchId) return;

    const messageText = text;
    setText("");

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: activeMatchId, messageText }),
        credentials: 'include',
      });

      if (res.ok) {
        const { data: msg } = await res.json();
        const newMessage: Message = {
          id: msg._id,
          senderId: msg.senderId?._id || msg.senderId,
          receiverId: msg.receiverId?._id || msg.receiverId,
          matchId: msg.matchId,
          messageText: msg.messageText,
          createdAt: msg.createdAt,
        };
        setMessages((prev) => [...prev, newMessage]);

        if (socket) {
          socket.emit("send-message", newMessage);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(messageText);
    }
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
              src={getImageUrl(conv.sockImage) || conv.otherUser.profilePicture || ""}
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
                src={getImageUrl(activeConversation.sockImage) || activeConversation.otherUser.profilePicture || ""}
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
                const isMe = msg.senderId === ((user as any)?._id || user?.id);
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
