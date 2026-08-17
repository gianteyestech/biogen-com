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
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-black mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-[#C9A84C] text-[#0D0D0D] font-bold rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}
