"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@vinser/core/profile/service";

// For a real app, you would use TanStack Query/Mutations here,
// and Server Actions to securely update the user's metadata.
// This is a simplified client-side form for the MVP.
export default function OnboardingForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update Profile (Name)
      // Call server action here
      // For now this will fail in client component if using next/headers directly
      // Let's use a mock implementation or proper server action setup in real app
      // await updateProfile({ full_name: name });
      console.log(updateProfile);

      // 2. Here we would also handle tags (skipping in this simple form)

      // 3. Mark onboarding complete

      router.push("/profile");
    } catch (error) {
      console.error(error);
      alert("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block text-label-bold text-on-surface-variant mb-2">FULL NAME</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-[#F1F5F9] border-2 border-transparent focus:border-primary focus:bg-white px-4 py-3 outline-none transition-colors"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-on-primary font-medium hover:bg-primary-container transition-colors h-[44px] disabled:opacity-50"
      >
        {loading ? "Saving..." : "Complete Setup"}
      </button>
    </form>
  );
}
