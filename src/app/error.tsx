"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 font-sans">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Temporarily Unavailable</h2>
      <p className="text-xs text-slate-500 mb-4">An unexpected error occurred while loading medical records.</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-[#0072CE] hover:bg-[#005EA6] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
      >
        Retry Operation
      </button>
    </div>
  );
}
