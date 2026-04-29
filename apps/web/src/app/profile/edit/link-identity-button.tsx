"use client";

import { useState } from "react";
import { createClient } from "@vinser/core/supabase/client";

export function LinkIdentityButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLink = async () => {
    setIsLoading(true);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/profile/edit`,
      },
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
      alert("Không thể liên kết tài khoản. " + error.message);
    }
  };

  return (
    <button
      onClick={handleLink}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary font-label-bold uppercase hover:bg-primary/5 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-lg">add_link</span>
      {isLoading ? "Đang chuyển hướng..." : "Liên kết thêm email (Google)"}
    </button>
  );
}
