import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { Conversation, Message } from "../types";
import { LiaSocksSolid } from "react-icons/lia";
import { IoSend } from "react-icons/io5";
import { getImageUrl, BASE_URL } from "../services/api";

export default function Messages() {
  const socket = useSocket();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/messages/conversations`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const userId = (user as any)?._id || user?.id;
        const convs: Conversation[] = (data || []).map((item: any) => {
          const match = item.match;
          const u1 = match.user1Id;
          const u2 = match.user2Id;
          const isU1 = u1._id === userId;
          const otherUser = isU1 ? u2 : u1;
          const otherSock = isU1 ? match.sock2Id : match.sock1Id;
          return {
            matchId: match._id,
            otherUser: { id: otherUser._id || otherUser.id, username: otherUser.username, profilePicture: otherUser.profilePicture },
            sockImage: otherSock?.images?.[0],
            lastMessage: item.lastMessage?.messageText,
          };
        });
        setConversations(convs);
      } catch {
        console.error("Failed to fetch conversations");
      }
    };
    fetchConversations();
  }, [user?.id]);

  useEffect(() => {
    if (!activeMatchId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/messages/${activeMatchId}`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setMessages(
          (data.messages || []).map((msg: any) => ({
            id: msg._id,
            senderId: msg.senderId?._id || msg.senderId,
            receiverId: msg.receiverId?._id || msg.receiverId,
            matchId: msg.matchId,
            messageText: msg.messageText,
            createdAt: msg.createdAt,
          }))
        );
      } catch {
        console.error("Failed to fetch messages");
      }
    };
    fetchMessages();

    if (socket) {
      socket.emit("join-match", activeMatchId);
      socket.on("receive-message", (newMessage: Message) => {
        if (newMessage.matchId === activeMatchId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      });
    }

    return () => {
      if (socket) { socket.emit("leave-match", activeMatchId); socket.off("receive-message"); }
    };
  }, [activeMatchId, socket]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeMatchId) return;
    const messageText = text;
    setText("");
    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: activeMatchId, messageText }),
        credentials: "include",
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
        if (socket) socket.emit("send-message", newMessage);
      }
    } catch {
      setText(messageText);
    }
  };

  const currentUserId = (user as any)?._id || user?.id;
  const activeConversation = conversations.find((c) => c.matchId === activeMatchId);

  return (
    <div
      style={{
        display: "flex",
        maxWidth: "820px",
        margin: "24px auto",
        padding: "0 16px",
        height: "calc(100vh - 160px)",
        minHeight: "480px",
        gap: "0",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "280px",
          flexShrink: 0,
          background: "#fff",
          borderRadius: "16px 0 0 16px",
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f0f0f0" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Chats</h3>
        </div>

        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          {conversations.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
              No matches yet. Start swiping!
            </div>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.matchId}
              onClick={() => setActiveMatchId(conv.matchId)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                cursor: "pointer",
                backgroundColor: activeMatchId === conv.matchId ? "#eff6ff" : "transparent",
                borderLeft: activeMatchId === conv.matchId ? "3px solid #0070f3" : "3px solid transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (activeMatchId !== conv.matchId) (e.currentTarget as HTMLDivElement).style.background = "#f9fafb"; }}
              onMouseLeave={(e) => { if (activeMatchId !== conv.matchId) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <img
                src={getImageUrl(conv.sockImage) || conv.otherUser.profilePicture || ""}
                alt=""
                style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "cover", flexShrink: 0, border: "1.5px solid #e5e7eb" }}
              />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{conv.otherUser.username}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {conv.lastMessage || "Say hello!"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          borderRadius: "0 16px 16px 0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        {activeMatchId && activeConversation ? (
          <>
            {/* Header */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={getImageUrl(activeConversation.sockImage) || activeConversation.otherUser.profilePicture || ""}
                alt=""
                style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", border: "1.5px solid #e5e7eb" }}
              />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700 }}>{activeConversation.otherUser.username}</div>
                <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 500 }}>Matched</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", background: "#f9fafb" }}>
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "68%",
                        padding: "10px 14px",
                        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        fontSize: "14px",
                        lineHeight: "1.45",
                        backgroundColor: isMe ? "#0070f3" : "#fff",
                        color: isMe ? "#fff" : "#111827",
                        boxShadow: isMe ? "0 2px 8px rgba(0,112,243,0.25)" : "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      {msg.messageText}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              style={{ padding: "12px 16px", borderTop: "1px solid #f0f0f0", display: "flex", gap: "10px", alignItems: "center", background: "#fff" }}
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, borderRadius: "50px", padding: "10px 16px", fontSize: "14px" }}
              />
              <button
                type="submit"
                style={{
                  width: "40px",
                  height: "40px",
                  flexShrink: 0,
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,112,243,0.3)",
                }}
              >
                <IoSend style={{ fontSize: "16px" }} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", gap: "12px" }}>
            <LiaSocksSolid style={{ fontSize: "40px", opacity: 0.4 }} />
            <p style={{ fontSize: "14px" }}>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
