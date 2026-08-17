"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, Headset, RefreshCw, Circle } from "lucide-react";

interface Thread {
  id: string;
  session_id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  last_message: string;
  updated_at: string;
}

interface Message {
  id: number;
  sender: "customer" | "admin";
  message: string;
  timestamp: string;
}

export default function AdminLiveChatPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch threads
  const fetchThreads = async () => {
    try {
      const res = await fetch("/api/admin/chat");
      const data = await res.json();
      if (res.ok && data.threads) {
        setThreads(data.threads);
        if (!selectedThread && data.threads.length > 0) {
          setSelectedThread(data.threads[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin threads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected thread
  const fetchMessages = async (threadId: string) => {
    try {
      const res = await fetch(`/api/admin/chat?threadId=${threadId}`);
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch thread messages:", err);
    }
  };

  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedThread) return;
    fetchMessages(selectedThread.id);
    const interval = setInterval(() => fetchMessages(selectedThread.id), 3000);
    return () => clearInterval(interval);
  }, [selectedThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyMessage.trim() || sending) return;

    const msg = replyMessage.trim();
    setReplyMessage("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedThread.id,
          message: msg,
        }),
      });

      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
        fetchThreads();
      }
    } catch (err) {
      console.error("Failed to send admin reply:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#18181b] border border-[#C9A84C]/20 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Live Customer Support Inbox</h1>
            <p className="text-xs text-gray-400 mt-0.5">Real-time visitor chat messaging & customer assistance.</p>
          </div>
        </div>

        <button
          onClick={fetchThreads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Inbox
        </button>
      </div>

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] h-[calc(100vh-250px)]">
        {/* Left Sidebar: Threads List */}
        <div className="bg-[#18181b] border border-[#C9A84C]/20 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-black/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Conversations ({threads.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-800/60">
            {threads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">No active customer chats yet.</div>
            ) : (
              threads.map((t) => {
                const isSelected = selectedThread?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedThread(t)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? "bg-[#C9A84C]/10 border-l-4 border-[#C9A84C]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-white">{t.customer_name}</p>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(t.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{t.last_message || "No messages yet"}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Conversation Messages */}
        <div className="lg:col-span-2 bg-[#18181b] border border-[#C9A84C]/20 rounded-2xl flex flex-col overflow-hidden">
          {selectedThread ? (
            <>
              {/* Active Thread Header */}
              <div className="p-4 bg-[#111111] border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedThread.customer_name}</h3>
                  <p className="text-[11px] text-gray-400">
                    Session: <span className="font-mono text-[#C9A84C]">{selectedThread.session_id}</span>
                    {selectedThread.customer_email && ` · ${selectedThread.customer_email}`}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  ● ACTIVE CHAT
                </span>
              </div>

              {/* Messages View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#141414]">
                {messages.map((m) => {
                  const isAdmin = m.sender === "admin";
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? "bg-[#C9A84C] text-black font-medium rounded-tr-none"
                            : "bg-[#1f1f23] border border-gray-800 text-gray-200 rounded-tl-none"
                        }`}
                      >
                        <p className="text-[9px] opacity-70 font-mono mb-1 uppercase tracking-wider">
                          {isAdmin ? "Admin (You)" : selectedThread.customer_name}
                        </p>
                        {m.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-[#111111] border-t border-gray-800 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${selectedThread.customer_name}...`}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-[#1f1f23] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C]"
                />
                <button
                  type="submit"
                  disabled={sending || !replyMessage.trim()}
                  className="px-5 py-2.5 bg-[#C9A84C] text-black font-bold text-xs rounded-xl hover:bg-[#d8b555] transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-gray-500 text-xs">
              Select a conversation from the sidebar to view messages.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
