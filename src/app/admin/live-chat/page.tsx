"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, RefreshCw } from "lucide-react";

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 font-sans antialiased text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#0E1526] border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#00A3E0]">
            <MessageSquare size={22} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#00A3E0] uppercase tracking-wider">Clinical Helpdesk</span>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">Practitioner &amp; Clinic Support Inbox</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time clinical consultations, bulk procurement inquiries, and support.</p>
          </div>
        </div>

        <button
          onClick={fetchThreads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#131D31] hover:bg-[#1E2D4A] border border-slate-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Inbox
        </button>
      </div>

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] h-[calc(100vh-250px)]">
        {/* Left Sidebar: Threads List */}
        <div className="bg-[#0E1526] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 bg-[#0A0F1D]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Inquiries ({threads.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {threads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">No active clinical inquiries yet.</div>
            ) : (
              threads.map((t) => {
                const isSelected = selectedThread?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedThread(t)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? "bg-blue-500/10 border-l-4 border-[#0072CE]" : "hover:bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-white">{t.customer_name}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(t.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{t.last_message || "No messages yet"}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Conversation Messages */}
        <div className="lg:col-span-2 bg-[#0E1526] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {selectedThread ? (
            <>
              {/* Active Thread Header */}
              <div className="p-4 bg-[#0A0F1D] border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedThread.customer_name}</h3>
                  <p className="text-[11px] text-slate-400">
                    Session: <span className="font-mono text-[#00A3E0]">{selectedThread.session_id}</span>
                    {selectedThread.customer_email && ` · ${selectedThread.customer_email}`}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  ● CONSULTATION ACTIVE
                </span>
              </div>

              {/* Messages View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070B14]">
                {messages.map((m) => {
                  const isAdmin = m.sender === "admin";
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? "bg-[#0072CE] text-white font-medium rounded-tr-none shadow-sm"
                            : "bg-[#0E1526] border border-slate-700 text-slate-200 rounded-tl-none"
                        }`}
                      >
                        <p className="text-[9px] opacity-75 font-mono mb-1 uppercase tracking-wider">
                          {isAdmin ? "Biogen Clinical Officer (You)" : selectedThread.customer_name}
                        </p>
                        {m.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-[#0A0F1D] border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${selectedThread.customer_name}...`}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-[#070B14] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0072CE]"
                />
                <button
                  type="submit"
                  disabled={sending || !replyMessage.trim()}
                  className="px-5 py-2.5 bg-[#0072CE] text-white font-bold text-xs rounded-xl hover:bg-[#005EA6] transition-all flex items-center gap-2 disabled:opacity-40 shadow-xs"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
              Select an inquiry thread from the left panel to begin assistance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
