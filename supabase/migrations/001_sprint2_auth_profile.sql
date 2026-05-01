-- Create custom types for privacy and connection status
CREATE TYPE privacy_level AS ENUM ('public', 'connections', 'private');
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  bio TEXT,
  contact_email TEXT,
  contact_email_privacy privacy_level DEFAULT 'connections',
  social_links JSONB DEFAULT '{}'::jsonb,
  social_links_privacy privacy_level DEFAULT 'connections',
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schools Table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Schools Table
CREATE TABLE public.user_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_domain TEXT NOT NULL REFERENCES public.schools(domain) ON DELETE CASCADE,
  school_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('student', 'alumni')),
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags Table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_category_name UNIQUE (category_id, lower(name))
);

-- Profile Tags Table
CREATE TABLE public.profile_tags (
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id, tag_id)
);

-- Connections Table
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status connection_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_connection UNIQUE (requester_id, recipient_id),
  CONSTRAINT prevent_self_connection CHECK (requester_id != recipient_id)
);

-- Indexes
CREATE INDEX idx_connections_recipient_status ON public.connections(recipient_id, status);
CREATE INDEX idx_profile_tags_tag_id ON public.profile_tags(tag_id);

-- Functions
CREATE OR REPLACE FUNCTION public.check_is_connected(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connections
    WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND recipient_id = target_user_id) OR
        (recipient_id = auth.uid() AND requester_id = target_user_id)
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.check_same_school(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_schools us1
    JOIN public.user_schools us2 ON us1.school_domain = us2.school_domain
    WHERE us1.user_id = auth.uid() AND us2.user_id = target_user_id
  );
$$;

-- Generic update timestamp function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- New user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_color TEXT;
  v_email_domain TEXT;
  v_public_domains TEXT[] := ARRAY['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
BEGIN
  -- Extract full name from raw_user_meta_data if available
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  -- Generate a random avatar color (simple implementation)
  v_avatar_color := '#' || lpad(to_hex(floor(random() * 16777215)::int), 6, '0');

  -- Insert profile
  INSERT INTO public.profiles (id, full_name, avatar_color, contact_email)
  VALUES (NEW.id, v_full_name, v_avatar_color, NEW.email);

  -- Extract email domain
  v_email_domain := split_part(NEW.email, '@', 2);

  -- School association (in a BEGIN...EXCEPTION block to not block user creation)
  BEGIN
    IF NOT (v_email_domain = ANY(v_public_domains)) THEN
      -- Upsert school
      INSERT INTO public.schools (domain, display_name)
      VALUES (v_email_domain, v_email_domain)
      ON CONFLICT (domain) DO NOTHING;

      -- Insert user_schools record
      INSERT INTO public.user_schools (user_id, school_domain, school_email, status)
      VALUES (NEW.id, v_email_domain, NEW.email, 'student');
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to associate user with school: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for identity limit and alumni
CREATE OR REPLACE FUNCTION public.enforce_identity_limit_and_alumni()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_identity_count INT;
  v_email_domain TEXT;
  v_public_domains TEXT[] := ARRAY['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
BEGIN
  -- Check identity count for the user
  SELECT count(*) INTO v_identity_count FROM auth.identities WHERE user_id = NEW.user_id;

  IF v_identity_count > 2 THEN
    -- In GoTrue this is hard to block cleanly without breaking the flow, so we silently return.
    -- (The client should prevent adding a 3rd identity anyway).
    -- Wait, if it's an AFTER INSERT trigger, we could delete the newly inserted row or raise exception,
    -- but silently returning from AFTER trigger doesn't undo the insert.
    -- Actually, raising an exception might break the auth flow. The plan says "silently returns (does nothing)".
    RETURN NEW;
  END IF;

  -- If it's the second identity, check if we need to add an alumni record
  IF v_identity_count = 2 THEN
    -- Extract email domain from identity data
    -- NEW.identity_data->>'email'
    v_email_domain := split_part(NEW.identity_data->>'email', '@', 2);

    IF v_email_domain IS NOT NULL AND NOT (v_email_domain = ANY(v_public_domains)) THEN
      BEGIN
        INSERT INTO public.schools (domain, display_name)
        VALUES (v_email_domain, v_email_domain)
        ON CONFLICT (domain) DO NOTHING;

        INSERT INTO public.user_schools (user_id, school_domain, school_email, status)
        VALUES (NEW.user_id, v_email_domain, NEW.identity_data->>'email', 'alumni');
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to associate alumni identity with school: %', SQLERRM;
      END;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on auth.identities
CREATE TRIGGER on_auth_identity_created
AFTER INSERT ON auth.identities
FOR EACH ROW EXECUTE FUNCTION public.enforce_identity_limit_and_alumni();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, Owner update
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Owner update profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Schools: Public read
CREATE POLICY "Public read schools" ON public.schools FOR SELECT USING (true);

-- User Schools: Public read (or same school, maybe public for now)
CREATE POLICY "Public read user schools" ON public.user_schools FOR SELECT USING (true);

-- Categories: Public read
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

-- Tags: Public read, Authenticated insert
CREATE POLICY "Public read tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated insert tags" ON public.tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Profile Tags: Public read, Owner insert/delete
CREATE POLICY "Public read profile_tags" ON public.profile_tags FOR SELECT USING (true);
CREATE POLICY "Owner insert profile_tags" ON public.profile_tags FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Owner delete profile_tags" ON public.profile_tags FOR DELETE USING (auth.uid() = profile_id);

-- Connections: Read own, create requests, update received requests
CREATE POLICY "Read own connections" ON public.connections FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Create connections" ON public.connections FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Update received connections" ON public.connections FOR UPDATE USING (auth.uid() = recipient_id);
