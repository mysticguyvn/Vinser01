import { createClient } from "@vinser/core/supabase/server";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.app_metadata?.onboarding_completed) {
    redirect("/profile");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-8 shadow-[0_4px_12px_rgba(53,37,205,0.05)] border border-surface-variant">
        <h1 className="text-headline-md text-on-surface mb-2 font-semibold font-be-vietnam">
          Complete Your Profile
        </h1>
        <p className="text-body-sm text-on-surface-variant mb-8 font-be-vietnam">
          Let&apos;s get your profile set up so you can connect with others.
        </p>
        <OnboardingForm initialName={user.user_metadata?.full_name || ""} />
      </div>
    </div>
  )
}
