# שימור ידע - גדוד ארז

## הרצה
1. **Supabase:** צור פרויקט ב-supabase.com. ב-SQL Editor הדבק והרץ את `supabase/schema.sql` (יוצר טבלאות, Bucket בשם `knowledge-files`, מדיניות ונתוני התחלה).
2. **משתני סביבה:** העתק `.env.local.example` ל-`.env.local` ומלא `NEXT_PUBLIC_SUPABASE_URL` ו-`NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings > API).
3. **מקומית:** `npm install` ואז `npm run dev`, ופתח http://localhost:3000.
4. **Vercel:** דחוף את הפרויקט ל-GitHub, ב-Vercel בחר Add New > Project וייבא אותו. הוסף את שני משתני הסביבה ולחץ Deploy.

## הערות
- Supabase מגביל כברירת מחדל העלאה ל-50MB בתוכנית החינמית. אם תרצה יותר, יש לשדרג תוכנית.
- ה-RLS פתוח לכולם לפי המפרט. אימות שם המעלה במחיקה נעשה בצד הלקוח בלבד.
