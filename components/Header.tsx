"use client";
import { Home, Info, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); setOpen(false); }
  };
  const link = "flex items-center gap-2 rounded-2xl px-4 py-3 font-medium text-olive hover:bg-olive/10";
  const searchBox = (cls: string) => (
    <form onSubmit={submit} className="relative">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש תפקיד או קובץ..."
        className={`rounded-2xl border bg-cream pe-3 ps-10 outline-none focus:border-rose ${cls}`} />
      <button className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500" aria-label="חיפוש"><Search size={18} /></button>
    </form>
  );
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" aria-label="ראשי"><img src="/logo.png" alt="לוגו גדוד ארז" className="h-10 w-10 object-contain" /></Link>
        <h1 className="text-lg font-bold text-rose-dark md:text-xl">שימור ידע - גדוד ארז</h1>
        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/" className={link}><Home size={18} />ראשי</Link>
          <Link href="/guide" className={link}><Info size={18} />מדריך שימוש</Link>
          {searchBox("w-64 py-2")}
        </nav>
        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="תפריט">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="space-y-2 border-t bg-white px-4 py-3 md:hidden">
          <Link href="/" onClick={() => setOpen(false)} className={link}><Home size={18} />ראשי</Link>
          <Link href="/guide" onClick={() => setOpen(false)} className={link}><Info size={18} />מדריך שימוש</Link>
          {searchBox("w-full py-3")}
        </div>
      )}
    </header>
  );
}
