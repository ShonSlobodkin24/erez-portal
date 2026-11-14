const steps = [
  ["בוחרים תפקיד", "נכנסים מהעמוד הראשי לתפקיד הרלוונטי."],
  ["עוברים בין מחזורים", "פותחים את אקורדיון המחזור הרצוי וצופים בפרטי התפקידן."],
  ["מורידים סיכומים ופורמטים", "לוחצים על אייקון ההורדה ליד כל קובץ."],
  ["מעלים העברת מקל", 'לוחצים על "+ הוסף קובץ", ממלאים שם מעלה ותיאור ובוחרים קובץ מהטלפון או מהמחשב.'],
  ["מוחקים קובץ שהעליתם", "לוחצים על סמל הפח ומאמתים עם שם המעלה שהוזן בהעלאה."],
];
export default function Guide() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="mb-8 text-3xl font-extrabold text-rose-dark">מדריך שימוש — איך משתמשים בפורטל?</h2>
      <ol className="space-y-4">
        {steps.map(([t, d], i) => (
          <li key={i} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-olive text-lg font-bold text-white">{i + 1}</span>
            <div><h3 className="font-bold">{t}</h3><p className="mt-1 text-gray-700">{d}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}
