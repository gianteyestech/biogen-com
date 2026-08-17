import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-black mb-2 text-[#C9A84C]">404</h2>
      <p className="text-xl mb-6">Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#C9A84C] text-[#0D0D0D] font-bold rounded-lg hover:opacity-90 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
