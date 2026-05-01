"use client";

import { signInWithOAuth } from "@vinser/core/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm rounded-xl bg-surface-container-lowest p-8 shadow-[0_4px_12px_rgba(53,37,205,0.05)] border border-surface-variant text-center">
        <h1 className="text-headline-md text-on-surface mb-2 font-semibold font-be-vietnam">
          Welcome to Academic Vitality
        </h1>
        <p className="text-body-sm text-on-surface-variant mb-8 font-be-vietnam">
          Sign in to connect with peers and alumni.
        </p>

        <button
          onClick={() => signInWithOAuth()}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-on-primary font-medium hover:bg-primary-container transition-colors h-[44px]"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
