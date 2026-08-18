import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 font-sans">
      <h2 className="text-4xl font-black mb-2 text-[#0072CE]">404</h2>
      <p className="text-lg text-slate-700 mb-6 font-semibold">Medical Page / Resource Not Found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#0072CE] text-white font-bold rounded-xl hover:bg-[#005EA6] transition text-xs uppercase tracking-wider shadow-sm"
      >
        ← Return to Medical Catalog
      </Link>
    </div>
  );
}
