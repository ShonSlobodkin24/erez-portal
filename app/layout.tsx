import "./globals.css";
import { Heebo } from "next/font/google";
import Header from "@/components/Header";
const heebo = Heebo({ subsets: ["hebrew", "latin"] });
export const metadata = { title: "שימור ידע - גדוד ארז" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t bg-white px-4 py-8 text-center text-sm text-gray-600">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-olive font-bold text-white">ארז</div>
          <p className="font-semibold">גדוד ארז - בה"ד 1</p>
          <p className="mt-2">"כֹּל אֲשֶׁר תִּמְצָא יָדְךָ לַעֲשׂוֹת בְּכֹחֲךָ עֲשֵׂה" (קהלת ט, י) | סמ"ל שון סלובודקין | ארז 94</p>
          <p className="mt-2">© 2026 כל הזכויות שמורות לגדוד ארז. נבנה בגאווה לשימור המורשת והידע.</p>
        </footer>
      </body>
    </html>
  );
}
