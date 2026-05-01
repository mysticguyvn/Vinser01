import { createClient } from "@vinser/core/supabase/server";
import { redirect } from "next/navigation";
import { type Database } from "@vinser/core";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const anyProfile = profile as unknown as Database['public']['Tables']['profiles']['Row'];

  const avatarColor = anyProfile?.avatar_color || '#3525cd';
  const fullName = anyProfile?.full_name || 'User';
  const initial = fullName.charAt(0).toUpperCase();
  const contactEmail = anyProfile?.contact_email;
  const bio = anyProfile?.bio;

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-container-max mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-headline-md font-semibold text-on-surface">Your Profile</h1>
          <form action="/auth/signout" method="post">
            <button className="text-body-sm text-primary hover:underline">Sign Out</button>
          </form>
        </header>

        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_4px_12px_rgba(53,37,205,0.05)] border border-surface-variant">
          <div className="flex items-center gap-6 mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-display-lg text-white font-bold"
              style={{ backgroundColor: avatarColor }}
            >
              {initial}
            </div>
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">{fullName}</h2>
              <p className="text-body-base text-on-surface-variant">{contactEmail}</p>
            </div>
          </div>

          {bio && (
            <div className="mb-8">
              <h3 className="text-label-bold text-on-surface-variant mb-2 uppercase tracking-wider">About</h3>
              <p className="text-body-base text-on-surface">{bio}</p>
            </div>
          )}

          <div>
             <h3 className="text-label-bold text-on-surface-variant mb-4 uppercase tracking-wider">Tags</h3>
             {/* Fetching tags in a real app would map over profile_tags */}
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-body-sm">Student</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
