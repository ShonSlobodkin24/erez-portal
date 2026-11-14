import Link from "next/link";
import { supabase, Role } from "@/lib/supabase";
import { Compass, Scale, Wrench, Truck, Laptop, Gamepad2, Users, Package } from "lucide-react";

export const dynamic = "force-dynamic";
const icons = [Compass, Scale, Wrench, Truck, Laptop, Gamepad2, Users, Package];

export default async function Home() {
  const { data } = await supabase.from("roles").select("*").order("sort_order");
  const roles = (data ?? []) as Role[];
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="py-12 text-center">
        <h2 className="text-3xl font-extrabold text-rose-dark md:text-5xl">פורטל העברת המקל של גדוד ארז</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
          ברוך הבא, רוחב גדודי יקר! מטרת מערכת זו היא לשמר ידע בין מתנסי הרוחב ממחזור למחזור. זוהי חובתנו להעלות את הפורמטים שיצרנו ולהעביר את המקל למי שיבוא אחרינו.
        </p>
        <p className="mt-4 font-semibold text-olive">יצירת סטנדרט גבוה הודות לנקודת פתיחה טובה יותר | הפריה הדדית | השארת חותם</p>
      </section>
      <section>
        <h3 className="mb-5 text-2xl font-bold text-olive">בחירת תפקיד</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {roles.map((r, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Link key={r.id} href={`/roles/${r.slug}`}
                className="flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md active:scale-95">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-rose/15 text-rose-dark"><Icon size={32} /></span>
                <span className="text-center font-bold">{r.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
