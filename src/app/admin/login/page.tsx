"use client";
import { useState, useActionState } from "react";
import { adminLogin } from "../actions";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

type LoginState = { error?: string } | null;

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(adminLogin, null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [forgotStatus, setForgotStatus] = useState("");

  const handleSendReset = async () => {
    if (!resetEmail) return;
    setSendingReset(true);
    setForgotStatus("");

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForgotStatus(`❌ ${data.error || "Failed to send reset link."}`);
      } else {
        setForgotStatus(`✅ ${data.message || "Reset link sent!"}`);
      }
    } catch (err: any) {
      setForgotStatus(`❌ ${err.message || "Network error. Failed to send reset link."}`);
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#070B14] font-sans antialiased text-white relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div className="bg-[#0E1526] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-800">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
                <Image src="/logo.png" alt="Biogen Pharma" width={56} height={56} className="object-contain" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Biogen Medical CMS</h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Pharmaceutical &amp; Clinical Operations</p>
          </div>

          {/* Form */}
          <form action={action} className="px-8 py-8 space-y-5">
            {state?.error && (
              <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Master Security Key
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[#00A3E0] hover:underline font-semibold"
                >
                  Forgot Key?
                </button>
              </div>
              <input
                type="password"
                name="password"
                id="admin-password"
                required
                autoFocus
                placeholder="Enter authorized credential"
                className="w-full px-4 py-3 bg-[#070B14] border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-[#0072CE] focus:ring-1 focus:ring-[#0072CE]/30 transition-all text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            >
              {pending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                "Authenticate & Access System →"
              )}
            </button>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 pt-2">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>WHO-GMP &amp; ISO 9001:2015 Encrypted Portal</span>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0E1526] border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset Administrative Access</h3>
            <p className="text-xs text-slate-400">
              Enter your registered clinical administration email (<span className="text-white font-mono">admin.biogen@gianteyetech.com</span>) to receive a secure recovery token.
            </p>

            {forgotStatus && (
              <p className="text-xs text-[#00A3E0] bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                {forgotStatus}
              </p>
            )}

            <input
              type="email"
              placeholder="admin.biogen@gianteyetech.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#070B14] border border-slate-700 rounded-xl text-white outline-none focus:border-[#0072CE] text-xs placeholder-slate-500"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sendingReset}
                onClick={handleSendReset}
                className="flex-1 py-2.5 text-white bg-[#0072CE] hover:bg-[#005EA6] rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                {sendingReset ? "Dispatching..." : "Send Reset Token"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
