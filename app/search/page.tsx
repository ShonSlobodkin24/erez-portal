"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Download } from "lucide-react";
import { supabase, Role, FileRow } from "@/lib/supabase";

type Hit = FileRow & { roles: { name: string; slug: string } | null; cycles: { name: string } | null };

function SearchInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const [text, setText] = useState(q);
  const [roles, setRoles] = useState<Role[]>([]);
  const [files, setFiles] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setText(q);
    const term = q.replace(/[,()%*]/g, " ").trim();
    if (!term) { setRoles([]); setFiles([]); return; }
    setLoading(true);
    const like = `%${term}%`;
    Promise.all([
      supabase.from("roles").select("*").or(`name.ilike.${like},description.ilike.${like}`),
      supabase.from("files").select("*, roles(name,slug), cycles(name)")
        .or(`title.ilike.${like},file_name.ilike.${like},uploader_name.ilike.${like}`).order("created_at", { ascending: false }),
    ]).then(([r, f]) => { setRoles((r.data ?? []) as Role[]); setFiles((f.data ?? []) as unknown as Hit[]); setLoading(false); });
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(text.trim())}`); }} className="relative mb-8">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="חיפוש תפקיד או קובץ..." className="w-full rounded-2xl border bg-white py-4 pe-4 ps-12 text-lg outline-none focus:border-rose" />
        <button className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500" aria-label="חיפוש"><Search /></button>
      </form>
      {loading && <p>מחפש...</p>}
      {q && !loading && (
        <>
          <h3 className="mb-3 text-xl font-bold text-olive">תפקידים / עמודים תואמים</h3>
          <div className="mb-8 space-y-2">
            {roles.map((r) => <Link key={r.id} href={`/roles/${r.slug}`} className="block rounded-2xl bg-white p-4 font-semibold shadow-sm">{r.name}</Link>)}
            {!roles.length && <p className="text-gray-500">לא נמצאו תפקידים.</p>}
          </div>
          <h3 className="mb-3 text-xl font-bold text-olive">קבצים שהועלו</h3>
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{f.title}</p>
                  <p className="text-xs text-gray-600">
                    <Link href={`/roles/${f.roles?.slug}`} className="underline">{f.roles?.name}</Link> · {f.cycles?.name} · {f.uploader_name}
                  </p>
                </div>
                <a href={f.public_url ?? "#"} aria-label="הורדה" className="grid h-11 w-11 place-items-center rounded-full bg-olive text-white"><Download size={20} /></a>
              </li>
            ))}
            {!files.length && <p className="text-gray-500">לא נמצאו קבצים.</p>}
          </ul>
        </>
      )}
    </div>
  );
}
export default function SearchPage() { return <Suspense><SearchInner /></Suspense>; }
