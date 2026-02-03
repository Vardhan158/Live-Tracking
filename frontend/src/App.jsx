import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

export default function App() {
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    socketRef.current = io("https://live-tracking-bapo.onrender.com");

    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current.id);
    });

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 👇 LISTEN typing events
    socketRef.current.on("typing", (user) => {
      setTypingUser(user);
    });

    socketRef.current.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinChat = () => {
    if (username.trim()) {
      socketRef.current.emit("join", username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit("sendMessage", message);
      socketRef.current.emit("stopTyping");
      setMessage("");
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socketRef.current.emit("typing");

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socketRef.current.emit("stopTyping");
    }, 1000);
  };

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
        <div className="bg-zinc-800 p-10 rounded-xl w-80">
          <h2 className="text-2xl mb-6 text-center">Join Chat</h2>
          <input
            className="w-full p-3 rounded bg-zinc-700 mb-4"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={joinChat}
            className="w-full bg-green-600 p-3 rounded"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-white">
      {/* Header */}
      <div className="bg-zinc-800 p-4 font-semibold">
        💬 Realtime Chat — {username}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.user === username;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl
                ${
                  isMe
                    ? "bg-green-600 rounded-br-none"
                    : "bg-zinc-700 rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-zinc-300 mb-1">
                    {msg.user}
                  </p>
                )}
                {msg.text}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 👇 Typing indicator */}
      {typingUser && typingUser !== username && (
        <div className="px-6 pb-2 text-sm italic text-zinc-400">
          {typingUser} is typing...
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-zinc-800 flex gap-2">
        <input
          className="flex-1 p-3 rounded bg-zinc-700 outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-6 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
