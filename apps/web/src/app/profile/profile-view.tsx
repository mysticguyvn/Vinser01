"use client";

export function ProfileView({
  profile,
  userSchools,
  tags,
  isOwner
}: {
  profile: any,
  userSchools: any[],
  tags: any[],
  isOwner: boolean
}) {
  const initial = profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "?";

  const skills = tags.filter((t: any) => t.categories?.type === 'skills');
  const interests = tags.filter((t: any) => t.categories?.type === 'interests');
  const needs = tags.filter((t: any) => t.categories?.type === 'needs');

  const socialLinks = typeof profile.social_links === 'string' ? JSON.parse(profile.social_links) : (profile.social_links || []);

  const primarySchool = userSchools[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg animate-in fade-in slide-in-from-bottom-4">
      <div className="lg:col-span-4 flex flex-col gap-stack-lg">
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm">
          <h2 className="font-headline-md text-on-surface mb-stack-md flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined text-primary">contact_page</span>
            Liên hệ
          </h2>
          <ul className="space-y-4 text-body-sm text-on-surface-variant">
            {profile.contact_email && (
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-outline">Email</span>
                  <span className="font-medium text-on-surface">{profile.contact_email}</span>
                </div>
              </li>
            )}

            {primarySchool && (
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-outline">Trường</span>
                  <span className="font-medium text-on-surface uppercase">
                    {primarySchool.school_domain}
                    {primarySchool.status === 'alumni' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant">
                        Cựu học sinh
                      </span>
                    )}
                  </span>
                </div>
              </li>
            )}

            {socialLinks.map((link: any, idx: number) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">link</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-outline capitalize">{link.platform}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-on-surface hover:text-primary transition-colors">
                    {link.label || link.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-stack-lg">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />

          <div
            className="w-24 h-24 shrink-0 rounded-full flex items-center justify-center text-display-lg font-bold text-white shadow-sm ring-4 ring-white"
            style={{ backgroundColor: profile.avatar_color || '#4d44e3' }}
          >
            {initial}
          </div>

          <div className="flex-1">
            <h1 className="text-display-lg font-bold text-on-surface tracking-tight mb-2">
              {profile.full_name}
            </h1>
            {profile.bio && (
              <p className="text-body-base text-on-surface-variant max-w-2xl">
                {profile.bio}
              </p>
            )}

            {primarySchool?.status === 'alumni' && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-body-sm font-medium">
                <span className="material-symbols-outlined text-sm">history_edu</span>
                Cựu học sinh {primarySchool.school_domain}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {skills.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">stars</span>
                Kỹ năng
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((tag: any) => (
                  <span key={tag.id} className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-body-sm font-medium">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {needs.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
              <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-sm">campaign</span>
                Đang tìm kiếm
              </h3>
              <div className="flex flex-wrap gap-2">
                {needs.map((tag: any) => (
                  <span key={tag.id} className="px-3 py-1.5 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/20 text-body-sm font-medium">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm md:col-span-2">
              <h3 className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">favorite</span>
                Sở thích
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((tag: any) => (
                  <span key={tag.id} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-body-sm font-medium">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
