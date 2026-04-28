"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitOnboarding } from "./actions";
import { useCategories, useTags } from "@vinser/queries";

const AVATAR_COLORS = [
  "#3525cd", // primary
  "#006a61", // secondary
  "#7e3000", // tertiary
  "#ba1a1a", // error
  "#4d44e3", // surface-tint
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary text-on-primary font-label-bold uppercase transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50"
    >
      {pending ? "Đang lưu..." : "Hoàn tất"}
    </button>
  );
}

export function OnboardingForm({
  initialName,
  initialBio,
  initialSelectedTags
}: {
  initialName: string,
  initialBio: string,
  initialSelectedTags: string[]
}) {
  const [step, setStep] = useState(1);
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: tags, isLoading: isTagsLoading } = useTags();

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      }
      if (prev.length >= 10) return prev;
      return [...prev, tagId];
    });
  };

  return (
    <div className="p-8">
      <div className="flex gap-2 mb-8">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-surface-variant'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-surface-variant'}`} />
      </div>

      <form action={async (formData) => { await submitOnboarding(formData); }}>
        <input type="hidden" name="avatarColor" value={color} />
        <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface mb-2">
                Hồ sơ cơ bản
              </h2>
              <p className="text-body-base text-on-surface-variant">
                Hãy bắt đầu bằng việc thiết lập "căn cước" của bạn.
              </p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-label-bold uppercase text-on-surface-variant mb-2">
                Họ và Tên *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={initialName}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors"
                placeholder="Nhập họ và tên thật của bạn"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-label-bold uppercase text-on-surface-variant mb-2">
                Giới thiệu ngắn (Bio)
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={initialBio}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 rounded-lg border-2 border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:outline-none transition-colors resize-none"
                placeholder="Một vài dòng về bản thân..."
              />
            </div>

            <div>
              <label className="block text-label-bold uppercase text-on-surface-variant mb-3">
                Màu sắc đại diện
              </label>
              <div className="flex gap-4">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-12 h-12 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-3 px-4 rounded-lg bg-primary text-on-primary font-label-bold uppercase transition-colors hover:bg-primary-container hover:text-on-primary-container"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface mb-2">
                Điểm mạnh & Sở thích
              </h2>
              <p className="text-body-base text-on-surface-variant">
                Chọn một vài thẻ để mọi người hiểu rõ hơn về bạn (tối đa 10 thẻ).
              </p>
            </div>

            <div className="h-[400px] overflow-y-auto pr-2 space-y-8 scrollbar-thin">
              {isCategoriesLoading || isTagsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
                </div>
              ) : (
                categories?.map((category: any) => {
                  const categoryTags = tags?.filter((t: any) => t.category_id === category.id) || [];
                  if (categoryTags.length === 0) return null;

                  const isNeeds = category.type === 'needs';
                  const isSkills = category.type === 'skills';

                  const activeClass = isNeeds
                    ? 'bg-tertiary/10 text-tertiary border-tertiary/30 font-medium'
                    : isSkills
                      ? 'bg-secondary/10 text-secondary border-secondary/30 font-medium'
                      : 'bg-primary/10 text-primary border-primary/30 font-medium';

                  const inactiveClass = 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant';

                  return (
                    <div key={category.id}>
                      <h3 className="text-label-bold uppercase text-on-surface-variant mb-3">
                        {category.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categoryTags.map((tag: any) => {
                          const isSelected = selectedTags.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={`px-4 py-2 rounded-full text-body-sm border transition-colors ${isSelected ? activeClass : inactiveClass}`}
                            >
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 flex justify-center py-3 px-4 rounded-lg bg-surface-container-high text-on-surface font-label-bold uppercase transition-colors hover:bg-surface-container-highest"
              >
                Quay lại
              </button>
              <div className="flex-1">
                <SubmitButton />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
