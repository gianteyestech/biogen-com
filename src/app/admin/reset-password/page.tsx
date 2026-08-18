"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0E1526] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 font-sans antialiased text-white">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-[#00A3E0] flex items-center justify-center mx-auto mb-3">
          <KeyRound size={24} />
        </div>
        <h1 className="text-xl font-bold text-white">Set New Administrative Password</h1>
        <p className="text-xs text-slate-400 mt-1">Enter your new secure credential below</p>
      </div>

      {success ? (
        <div className="text-center space-y-4 py-4">
          <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
          <p className="text-sm font-semibold text-white">Security Credential Updated Successfully!</p>
          <Link
            href="/admin/login"
            className="inline-block px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6] transition-all shadow-md"
          >
            Authenticate to CMS →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950/50 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              New Master Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#070B14] border border-slate-700 rounded-xl text-white outline-none focus:border-[#0072CE] text-xs placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Confirm Master Password
            </label>
            <input
              type="password"
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#070B14] border border-slate-700 rounded-xl text-white outline-none focus:border-[#0072CE] text-xs placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0072CE] hover:bg-[#005EA6] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : "Save New Master Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#070B14]">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-center text-slate-400"><Loader2 size={32} className="animate-spin mx-auto text-[#0072CE]" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
