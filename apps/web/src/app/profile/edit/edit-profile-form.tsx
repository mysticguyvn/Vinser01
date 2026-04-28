"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";
import { LinkIdentityButton } from "./link-identity-button";

export function EditProfileForm({ profile, userSchools }: { profile: any, userSchools: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialSocials = typeof profile.social_links === 'string'
    ? JSON.parse(profile.social_links)
    : (profile.social_links || []);

  const fbLink = initialSocials.find((s: any) => s.platform === 'facebook')?.url || '';
  const ttLink = initialSocials.find((s: any) => s.platform === 'tiktok')?.url || '';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const socials = [];
    const fb = formData.get('facebookUrl') as string;
    const tt = formData.get('tiktokUrl') as string;

    if (fb) socials.push({ platform: 'facebook', url: fb });
    if (tt) socials.push({ platform: 'tiktok', url: tt });

    formData.set('socialLinks', JSON.stringify(socials));

    const result = await updateProfile(formData);

    setIsLoading(false);

    if (result.success) {
      router.push("/profile");
      router.refresh();
    } else {
      setError(result.error || "Có lỗi xảy ra");
    }
  }

  return (
    <div className="space-y-stack-lg animate-in fade-in slide-in-from-bottom-4">
      <form onSubmit={handleSubmit} className="space-y-stack-lg">
        {error && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-md text-on-surface mb-stack-md font-semibold">Thông tin cơ bản</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-label-bold uppercase text-on-surface-variant mb-2">
                Họ và Tên *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile.full_name || ""}
                required
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-label-bold uppercase text-on-surface-variant mb-2">
                Giới thiệu ngắn (Bio)
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ""}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none"
              />
              <p className="mt-1 flex justify-end text-xs text-on-surface-variant">Max 160 ký tự</p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm">
          <h2 className="font-headline-md text-on-surface mb-stack-md font-semibold">Liên hệ & Mạng xã hội</h2>
          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 items-center">
              <div className="flex items-center gap-2 text-on-surface-variant w-32">
                <span className="material-symbols-outlined">mail</span>
                <span className="font-label-bold uppercase">Email LH</span>
              </div>
              <input
                name="contactEmail"
                type="email"
                defaultValue={profile.contact_email || ""}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:outline-none"
              />
              <select
                name="contactEmailPrivacy"
                defaultValue={profile.contact_email_privacy || "same_school"}
                className="px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface-variant appearance-none pr-10 min-w-[160px]"
              >
                <option value="public">Công khai</option>
                <option value="same_school">Chỉ cùng trường</option>
                <option value="connections_only">Chỉ đã kết nối</option>
                <option value="only_me">Chỉ mình tôi</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">
              <div className="flex items-center gap-2 text-on-surface-variant w-32">
                <span className="material-symbols-outlined">public</span>
                <span className="font-label-bold uppercase">Facebook</span>
              </div>
              <input
                name="facebookUrl"
                type="url"
                defaultValue={fbLink}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">
              <div className="flex items-center gap-2 text-on-surface-variant w-32">
                <span className="material-symbols-outlined">smart_display</span>
                <span className="font-label-bold uppercase">TikTok</span>
              </div>
              <input
                name="tiktokUrl"
                type="url"
                defaultValue={ttLink}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface text-on-surface focus:border-primary focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Quyền riêng tư mạng xã hội</span>
              <select
                name="socialLinksPrivacy"
                defaultValue={profile.social_links_privacy || "same_school"}
                className="px-4 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface-variant appearance-none text-sm pr-10"
              >
                <option value="public">Công khai</option>
                <option value="same_school">Chỉ cùng trường</option>
                <option value="connections_only">Chỉ đã kết nối</option>
                <option value="only_me">Chỉ mình tôi</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 px-4 rounded-lg bg-surface-container-high text-on-surface font-label-bold uppercase hover:bg-surface-container-highest transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-3 px-4 rounded-lg bg-primary text-on-primary font-label-bold uppercase hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>

      <section className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 shadow-sm mt-8">
        <h2 className="font-headline-md text-on-surface mb-stack-md font-semibold">Tài khoản & Liên kết trường</h2>
        <p className="text-body-sm text-on-surface-variant mb-6">
          Các email đã được liên kết với hồ sơ này.
        </p>

        <ul className="space-y-4 mb-6">
          {userSchools.map(school => (
            <li key={school.id} className="flex justify-between items-center p-4 bg-surface rounded-lg border border-outline-variant/50">
              <div className="flex flex-col">
                <span className="font-medium text-on-surface">{school.school_email}</span>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider">{school.school_domain}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                school.status === 'alumni'
                  ? 'bg-surface-variant text-on-surface-variant'
                  : 'bg-primary/10 text-primary'
              }`}>
                {school.status === 'alumni' ? 'Cựu học sinh' : 'Đang học'}
              </span>
            </li>
          ))}
        </ul>

        <LinkIdentityButton />
      </section>
    </div>
  );
}
