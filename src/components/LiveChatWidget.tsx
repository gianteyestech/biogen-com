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
    let sid = localStorage.getItem("biogen_chat_session");
    if (!sid) {
      sid = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem("biogen_chat_session", sid);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(sid);

    const savedName = localStorage.getItem("biogen_chat_name");
    const savedEmail = localStorage.getItem("biogen_chat_email");
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

    localStorage.setItem("biogen_chat_name", customerName.trim());
    if (customerEmail.trim()) {
      localStorage.setItem("biogen_chat_email", customerEmail.trim());
    }
    setIsRegistered(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    // Optimistic UI update
    const tempMsg: Message = {
      id: Date.now(),
      sender: "customer",
      message: textToSend,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          sender: "customer",
          name: customerName,
          email: customerEmail,
          message: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
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
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#0072CE] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group hover:bg-[#005EA6]"
        aria-label="Live Customer Support"
      >
        <div className="relative">
          <MessageSquare size={22} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0072CE] animate-pulse" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-white">
          Biogen Chat
        </span>
      </button>

      {/* Live Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-5 z-50 w-[88vw] sm:w-[350px] h-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Window Header */}
          <div className="bg-[#0A0F1D] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-[#00A3E0]">
                <Headset size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">Biogen Pharma Clinical Support</p>
                <p className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · Ready to assist
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/10 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Registration Form / Chat Body */}
          {!isRegistered ? (
            <form onSubmit={handleRegister} className="flex-1 p-6 flex flex-col justify-center gap-4 bg-slate-50">
              <div className="text-center space-y-1 mb-2">
                <h3 className="text-sm font-bold text-slate-800">Start a Medical Inquiry</h3>
                <p className="text-xs text-slate-500">Please enter your name or clinic details to connect.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Your Name / Institution *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. John / Apex Clinic"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0072CE]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. clinic@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0072CE]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0072CE] text-white font-bold text-xs rounded-xl hover:bg-[#005EA6] transition-all uppercase tracking-wider mt-2 shadow-sm"
              >
                Start Biogen Chat →
              </button>
            </form>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
              {/* Messages Scroll View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {/* Default Greeting */}
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-100 border border-[#0072CE]/30 flex items-center justify-center text-[#0072CE] text-xs flex-shrink-0">
                    <Headset size={14} />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-xs text-slate-800 leading-relaxed shadow-xs">
                    👋 Hello <strong>{customerName}</strong>! Welcome to Biogen Pharma. How can our medical desk assist your clinic or hospital today?
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
                        <div className="w-7 h-7 rounded-full bg-blue-100 border border-[#0072CE]/30 flex items-center justify-center text-[#0072CE] text-xs flex-shrink-0">
                          <Headset size={14} />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                          isAdmin
                            ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
                            : "bg-[#0072CE] text-white font-medium rounded-tr-none shadow-sm"
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
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your medical inquiry..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0072CE] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="p-2.5 bg-[#0072CE] text-white rounded-xl hover:bg-[#005EA6] transition-all disabled:opacity-40"
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
