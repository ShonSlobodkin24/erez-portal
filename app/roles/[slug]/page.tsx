import { notFound } from "next/navigation";
import { supabase, Role } from "@/lib/supabase";
import RoleView from "@/components/RoleView";

export const dynamic = "force-dynamic";
export default async function RolePage({ params }: { params: { slug: string } }) {
  const { data } = await supabase.from("roles").select("*").eq("slug", params.slug).maybeSingle();
  if (!data) notFound();
  return <RoleView initialRole={data as Role} />;
}
