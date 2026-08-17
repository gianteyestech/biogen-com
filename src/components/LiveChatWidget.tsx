"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Headset, CheckCircle2, RefreshCw } from "lucide-react";

interface Message {
  id: number;
  sender: "customer" | "admin";
  message: string;
  timestamp: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or retrieve Session ID from localStorage
  useEffect(() => {
    let sid = localStorage.getItem("idf_chat_session");
    if (!sid) {
      sid = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem("idf_chat_session", sid);
    }
    setSessionId(sid);

    const savedName = localStorage.getItem("idf_chat_name");
    const savedEmail = localStorage.getItem("idf_chat_email");
    if (savedName) {
      setCustomerName(savedName);
      setCustomerEmail(savedEmail || "");
      setIsRegistered(true);
    }
  }, []);

  // Poll for message updates every 3 seconds when chat is open
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        const data = await res.json();
        if (res.ok && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Chat poll error:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    localStorage.setItem("idf_chat_name", customerName);
    localStorage.setItem("idf_chat_email", customerEmail);
    setIsRegistered(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const msgText = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customerName,
          customerEmail,
          message: msgText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to send chat message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button (Bottom Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#111111] text-[#C9A84C] border-2 border-[#C9A84C] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
        aria-label="Live Customer Support"
      >
        <div className="relative">
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
        </div>
        <span className="text-xs font-black uppercase tracking-wider hidden sm:inline text-white group-hover:text-[#C9A84C] transition-colors">
          Live Chat
        </span>
      </button>

      {/* Live Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-5 z-50 w-[88vw] sm:w-[330px] h-[430px] bg-[#18181b] border-2 border-[#C9A84C]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Window Header */}
          <div className="bg-[#111111] p-4 border-b border-[#C9A84C]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
                <Headset size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Ideal Dry Fruit Support</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · Typically replies in seconds
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Registration Form / Chat Body */}
          {!isRegistered ? (
            <form onSubmit={handleRegister} className="flex-1 p-6 flex flex-col justify-center gap-4 bg-[#141414]">
              <div className="text-center space-y-1 mb-2">
                <h3 className="text-sm font-bold text-white">Start a Conversation</h3>
                <p className="text-xs text-gray-400">Please enter your name to connect with our support agent.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Malik"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1f1f23] border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. usman@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1f1f23] border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#C9A84C] text-black font-bold text-xs rounded-xl hover:bg-[#d8b555] transition-all uppercase tracking-wider mt-2"
              >
                Start Chat →
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#141414]">
              {/* Messages Scroll View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {/* Default Greeting */}
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] text-xs flex-shrink-0">
                    <Headset size={14} />
                  </div>
                  <div className="bg-[#1f1f23] border border-gray-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-xs text-gray-200 leading-relaxed">
                    👋 Hello <strong>{customerName}</strong>! Welcome to Ideal Dry Fruit. How can we help you today?
                  </div>
                </div>

                {messages.map((msg) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 items-start ${isAdmin ? "justify-start" : "justify-end"}`}
                    >
                      {isAdmin && (
                        <div className="w-7 h-7 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C] text-xs flex-shrink-0">
                          <Headset size={14} />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                          isAdmin
                            ? "bg-[#1f1f23] border border-gray-800 text-gray-200 rounded-tl-none"
                            : "bg-[#C9A84C] text-black font-medium rounded-tr-none"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="p-3 bg-[#111111] border-t border-gray-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#1f1f23] border border-gray-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                />
                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="p-2.5 bg-[#C9A84C] text-black rounded-xl hover:bg-[#d8b555] transition-all disabled:opacity-40"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
