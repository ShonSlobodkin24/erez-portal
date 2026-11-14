"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Download, Trash2, Phone, Plus, FileText, Pencil } from "lucide-react";
import { supabase, Role, Cycle, FileRow } from "@/lib/supabase";
import { UploadModal, DeleteModal } from "./FileModals";

const fmtSize = (n: number | null) => !n ? "" : n < 1048576 ? `${Math.max(1, Math.round(n / 1024))}KB` : `${(n / 1048576).toFixed(1)}MB`;
const input = "w-full rounded-2xl border bg-cream px-4 py-3 outline-none focus:border-rose";

function FileItem({ f, onDelete }: { f: FileRow; onDelete: () => void }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-cream p-3">
      <FileText className="shrink-0 text-olive" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{f.title}</p>
        <p className="truncate text-xs text-gray-600">{f.uploader_name} · {f.file_name} · {fmtSize(f.file_size)}</p>
      </div>
      <a href={f.public_url ?? "#"} aria-label="הורדה" className="grid h-11 w-11 place-items-center rounded-full bg-olive text-white"><Download size={20} /></a>
      <button onClick={onDelete} aria-label="מחיקה" className="grid h-11 w-11 place-items-center rounded-full bg-rose/20 text-rose-dark"><Trash2 size={20} /></button>
    </li>
  );
}

export default function RoleView({ initialRole }: { initialRole: Role }) {
  const [role, setRole] = useState(initialRole);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [upload, setUpload] = useState<{ cycle: Cycle; cat: "format" | "handover" } | null>(null);
  const [del, setDel] = useState<FileRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [nc, setNc] = useState({ name: "", officer: "", phone: "" });
  const [editMsg, setEditMsg] = useState(false);
  const [msg, setMsg] = useState({ text: initialRole.handover_message ?? "", author: initialRole.handover_author ?? "" });

  const load = useCallback(async () => {
    const [c, f] = await Promise.all([
      supabase.from("cycles").select("*").eq("role_id", role.id).order("created_at", { ascending: false }),
      supabase.from("files").select("*").eq("role_id", role.id).order("created_at", { ascending: false }),
    ]);
    const cs = (c.data ?? []) as Cycle[];
    setCycles(cs); setFiles((f.data ?? []) as FileRow[]);
    setOpenId((cur) => cur ?? cs[0]?.id ?? null);
  }, [role.id]);
  useEffect(() => { load(); }, [load]);

  const addCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nc.name.trim()) return;
    await supabase.from("cycles").insert({ role_id: role.id, name: nc.name.trim(), officer_name: nc.officer.trim() || null, officer_phone: nc.phone.trim() || null });
    setNc({ name: "", officer: "", phone: "" }); setShowNew(false); load();
  };
  const saveMsg = async () => {
    await supabase.from("roles").update({ handover_message: msg.text || null, handover_author: msg.author || null }).eq("id", role.id);
    setRole({ ...role, handover_message: msg.text, handover_author: msg.author }); setEditMsg(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 font-medium text-olive"><ArrowRight size={18} />חזרה לכל התפקידים</Link>
      <h2 className="text-3xl font-extrabold text-rose-dark">{role.name}</h2>
      <p className="mt-1 text-gray-600">{role.description}</p>

      <section className="my-6 rounded-2xl border-s-4 border-olive bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-bold text-olive">דבר התפקידן מנחיל הידע</h3>
          <button onClick={() => setEditMsg(!editMsg)} aria-label="עריכה"><Pencil size={18} /></button>
        </div>
        {editMsg ? (
          <div className="space-y-2">
            <textarea className={input} rows={4} value={msg.text} onChange={(e) => setMsg({ ...msg, text: e.target.value })} placeholder="פנייה אישית..." />
            <input className={input} value={msg.author} onChange={(e) => setMsg({ ...msg, author: e.target.value })} placeholder="חתימה" />
            <button onClick={saveMsg} className="rounded-2xl bg-olive px-5 py-3 font-bold text-white">שמירה</button>
          </div>
        ) : role.handover_message ? (
          <><p className="whitespace-pre-line leading-relaxed">{role.handover_message}</p><p className="mt-2 font-semibold text-rose-dark">— {role.handover_author}</p></>
        ) : <p className="text-gray-500">עדיין לא נכתב דבר תפקידן. לחץ על העיפרון כדי להוסיף.</p>}
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-olive">מחזורים</h3>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1 rounded-2xl bg-rose-dark px-4 py-3 font-bold text-white"><Plus size={18} />מחזור חדש</button>
      </div>
      {showNew && (
        <form onSubmit={addCycle} className="mb-4 grid gap-2 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4">
          <input className={input} placeholder="שם מחזור" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} />
          <input className={input} placeholder="שם התפקידן" value={nc.officer} onChange={(e) => setNc({ ...nc, officer: e.target.value })} />
          <input className={input} placeholder="טלפון" inputMode="tel" value={nc.phone} onChange={(e) => setNc({ ...nc, phone: e.target.value })} />
          <button className="rounded-2xl bg-olive px-5 py-3 font-bold text-white">הוספה</button>
        </form>
      )}

      <div className="space-y-3">
        {cycles.map((c) => {
          const open = openId === c.id;
          const mine = files.filter((f) => f.cycle_id === c.id);
          const Section = ({ cat, label }: { cat: "format" | "handover"; label: string }) => (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-bold">{label}</h4>
                <button onClick={() => setUpload({ cycle: c, cat })} className="rounded-2xl bg-olive/10 px-3 py-2 text-sm font-bold text-olive">+ הוסף קובץ</button>
              </div>
              <ul className="space-y-2">
                {mine.filter((f) => f.category === cat).map((f) => <FileItem key={f.id} f={f} onDelete={() => setDel(f)} />)}
                {!mine.some((f) => f.category === cat) && <li className="text-sm text-gray-500">אין קבצים עדיין.</li>}
              </ul>
            </div>
          );
          return (
            <div key={c.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <button onClick={() => setOpenId(open ? null : c.id)} className="flex w-full items-center justify-between p-5 text-start">
                <span className="text-lg font-bold">{c.name}</span>
                <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="border-t p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold">{c.officer_name ?? "שם התפקידן לא הוזן"}</span>
                    {c.officer_phone && <a href={`tel:${c.officer_phone}`} className="inline-flex items-center gap-1 rounded-2xl bg-rose/15 px-4 py-2 font-medium text-rose-dark" dir="ltr"><Phone size={16} />{c.officer_phone}</a>}
                  </div>
                  <Section cat="format" label="פורמטים" />
                  <Section cat="handover" label="קובץ העברת מקל" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {upload && <UploadModal roleId={role.id} cycle={upload.cycle} defaultCategory={upload.cat} onClose={() => setUpload(null)} onDone={load} />}
      {del && <DeleteModal file={del} onClose={() => setDel(null)} onDone={load} />}
    </div>
  );
}
