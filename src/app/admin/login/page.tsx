"use client";
import { useState, useActionState } from "react";
import { adminLogin } from "../actions";
import Image from "next/image";

const goldGrad = "linear-gradient(135deg, #F0C040 0%, #C9A84C 55%, #B8922B 100%)";

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0D0D0D 0%, #1a1400 50%, #0D0D0D 100%)" }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #C9A84C 1px, transparent 1px), radial-gradient(circle at 75% 75%, #C9A84C 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#181818] border border-[#C9A84C]/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-[#C9A84C]/10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-[#C9A84C]/50 overflow-hidden bg-black flex items-center justify-center">
                <Image src="/ideal-logo.png" alt="Ideal Dry Fruit" width={56} height={56} className="object-cover" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">CMS Admin</h1>
            <p className="text-sm text-gray-400 mt-1">Ideal Dry Fruit — Content Manager</p>
          </div>

          {/* Form */}
          <form action={action} className="px-8 py-8 space-y-5">
            {state?.error && (
              <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                {state.error}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                  Admin Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[#C9A84C] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                id="admin-password"
                required
                autoFocus
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider text-[#0D0D0D] transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: goldGrad }}
            >
              {pending ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0D0D0D]/40 border-t-[#0D0D0D] rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In to CMS →"
              )}
            </button>

            <p className="text-center text-xs text-gray-600">
              Protected area — authorized personnel only
            </p>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#C9A84C]/30 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Reset Admin Password</h3>
            <p className="text-xs text-gray-400">
              Enter your registered admin email address (<span className="text-white font-mono">admin@idealdryfruit.com</span>) to receive a password reset link.
            </p>

            {forgotStatus && (
              <p className="text-xs text-[#C9A84C] bg-[#C9A84C]/10 p-3 rounded-xl border border-[#C9A84C]/20">
                {forgotStatus}
              </p>
            )}

            <input
              type="email"
              placeholder="admin@idealdryfruit.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white outline-none focus:border-[#C9A84C] text-sm"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sendingReset}
                onClick={handleSendReset}
                className="flex-1 py-2.5 text-[#0D0D0D] rounded-xl text-xs font-bold transition-colors"
                style={{ background: goldGrad }}
              >
                {sendingReset ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
