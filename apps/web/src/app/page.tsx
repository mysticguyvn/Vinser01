import { createClient } from "@vinser/core/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.app_metadata?.onboarding_completed) {
    redirect("/onboarding");
  }

  redirect("/profile");
}
