-- Insert initial Categories
INSERT INTO public.categories (name, type) VALUES
  ('Skills', 'skills'),
  ('Interests', 'interests'),
  ('Needs', 'needs'),
  ('Study/Major', 'study'),
  ('Topics', 'topics');

-- Insert Seed Tags
DO $$
DECLARE
  v_skills_id UUID;
  v_interests_id UUID;
BEGIN
  SELECT id INTO v_skills_id FROM public.categories WHERE name = 'Skills';
  SELECT id INTO v_interests_id FROM public.categories WHERE name = 'Interests';

  INSERT INTO public.tags (category_id, name, is_system) VALUES
    (v_skills_id, 'TypeScript', true),
    (v_skills_id, 'React', true),
    (v_skills_id, 'Next.js', true),
    (v_skills_id, 'Design', true),
    (v_interests_id, 'AI', true),
    (v_interests_id, 'Machine Learning', true),
    (v_interests_id, 'Web Development', true);
END $$;
