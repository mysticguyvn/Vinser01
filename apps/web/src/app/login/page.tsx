import { redirect } from "next/navigation";
import { createClient } from "@vinser/core/supabase/server";
import { LoginButton } from "./login-button";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md rounded-xl bg-surface-container-lowest p-8 shadow-sm border border-outline-variant/30 text-center">
        <div className="mb-8">
          <h1 className="text-display-lg font-bold text-primary tracking-tight mb-2">
            Vinser
          </h1>
          <p className="text-body-base text-on-surface-variant">
            Nền tảng kết nối học sinh nội bộ
          </p>
        </div>

        <LoginButton />

        <p className="mt-8 text-body-sm text-on-surface-variant">
          Chỉ hỗ trợ đăng nhập bằng email trường học.
        </p>
      </div>
    </div>
  );
}
