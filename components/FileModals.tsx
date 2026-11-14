"use client";
import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { supabase, BUCKET, Cycle, FileRow } from "@/lib/supabase";

const MAX = 50 * 1024 * 1024;
const box = "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4";
const card = "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl";
const input = "w-full rounded-2xl border bg-cream px-4 py-3 outline-none focus:border-rose";
const btn = "rounded-2xl px-5 py-3 font-bold text-white disabled:opacity-50";

export function UploadModal({ roleId, cycle, defaultCategory, onClose, onDone }: {
  roleId: string; cycle: Cycle; defaultCategory: "format" | "handover"; onClose: () => void; onDone: () => void;
}) {
  const [uploader, setUploader] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const pick = (f?: File) => {
    if (!f) return;
    if (f.size > MAX) { setErr("הקובץ גדול מ-50MB"); return; }
    setErr(""); setFile(f);
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploader.trim() || !title.trim() || !file) { setErr("יש למלא את כל השדות ולבחור קובץ"); return; }
    setBusy(true); setErr("");
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${roleId}/${cycle.id}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type || undefined });
    if (up.error) { setErr("ההעלאה נכשלה: " + up.error.message); setBusy(false); return; }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path, { download: file.name });
    const ins = await supabase.from("files").insert({
      cycle_id: cycle.id, role_id: roleId, category, title: title.trim(), uploader_name: uploader.trim(),
      file_name: file.name, file_size: file.size, mime_type: file.type, storage_path: path, public_url: pub.publicUrl,
    });
    if (ins.error) {
      await supabase.storage.from(BUCKET).remove([path]);
      setErr("שמירת הרשומה נכשלה: " + ins.error.message); setBusy(false); return;
    }
    onDone(); onClose();
  };
  return (
    <div className={box} onClick={onClose}>
      <form onSubmit={submit} className={card} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-rose-dark">הוספת קובץ – {cycle.name}</h3>
          <button type="button" onClick={onClose} aria-label="סגירה"><X /></button>
        </div>
        <div className="space-y-3">
          <input className={input} placeholder="שם המעלה" value={uploader} onChange={(e) => setUploader(e.target.value)} />
          <input className={input} placeholder="שם הקובץ / תיאור" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className={input} value={category} onChange={(e) => setCategory(e.target.value as "format" | "handover")}>
            <option value="format">פורמט</option>
            <option value="handover">קובץ העברת מקל</option>
          </select>
          <div
            onClick={() => ref.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center ${drag ? "border-rose bg-rose/10" : "border-gray-300"}`}>
            <UploadCloud className="mx-auto mb-2 text-olive" size={32} />
            <p className="text-sm">{file ? file.name : "גרור קובץ לכאן או לחץ לבחירה (עד 50MB)"}</p>
            <input ref={ref} type="file" hidden onChange={(e) => pick(e.target.files?.[0])} />
          </div>
          {err && <p className="text-sm font-medium text-red-600">{err}</p>}
          <button disabled={busy} className={`${btn} flex w-full items-center justify-center gap-2 bg-rose-dark`}>
            {busy && <Loader2 className="animate-spin" size={18} />}{busy ? "מעלה..." : "העלאה"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function DeleteModal({ file, onClose, onDone }: { file: FileRow; onClose: () => void; onDone: () => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const norm = (s: string) => s.replace(/\s+/g, " ").trim();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (norm(name) !== norm(file.uploader_name)) { setErr("שם המעלה אינו תואם. לא ניתן למחוק."); return; }
    setBusy(true);
    const rm = await supabase.storage.from(BUCKET).remove([file.storage_path]);
    if (rm.error) { setErr("מחיקה מהאחסון נכשלה"); setBusy(false); return; }
    const del = await supabase.from("files").delete().eq("id", file.id);
    if (del.error) { setErr("מחיקת הרשומה נכשלה"); setBusy(false); return; }
    onDone(); onClose();
  };
  return (
    <div className={box} onClick={onClose}>
      <form onSubmit={submit} className={card} onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-2 text-xl font-bold text-rose-dark">מחיקת קובץ</h3>
        <p className="mb-4 text-sm text-gray-700">למחיקת "{file.title}" יש להקליד את שם המעלה המדויק.</p>
        <input className={input} placeholder="שם המעלה" value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} />
        {err && <p className="mt-2 text-sm font-medium text-red-600">{err}</p>}
        <div className="mt-4 flex gap-3">
          <button disabled={busy} className={`${btn} flex-1 bg-red-600`}>{busy ? "מוחק..." : "מחק"}</button>
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl bg-gray-200 px-5 py-3 font-bold">ביטול</button>
        </div>
      </form>
    </div>
  );
}
