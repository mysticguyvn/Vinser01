CREATE TYPE privacy_level AS ENUM ('public', 'same_school', 'connections_only', 'only_me');
CREATE TYPE school_status AS ENUM ('student', 'alumni');

CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_color TEXT,
    bio TEXT,
    contact_email TEXT,
    contact_email_privacy privacy_level DEFAULT 'same_school',
    social_links JSONB DEFAULT '[]'::jsonb,
    social_links_privacy privacy_level DEFAULT 'same_school',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    school_domain TEXT NOT NULL,
    school_email TEXT NOT NULL,
    status school_status DEFAULT 'student',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, school_domain)
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (category_id, name)
);

CREATE TABLE profile_tags (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (profile_id, tag_id)
);

-- Indexes
CREATE INDEX idx_user_schools_domain ON user_schools(school_domain);
CREATE INDEX idx_user_schools_user_id ON user_schools(user_id);
CREATE INDEX idx_tags_category ON tags(category_id);

-- Check same school function
CREATE OR REPLACE FUNCTION check_same_school(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_schools t1
        JOIN user_schools t2 ON t1.school_domain = t2.school_domain
        WHERE t1.user_id = auth.uid() AND t2.user_id = target_user_id
    );
END;
$$;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_tags ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can read profiles with public privacy"
    ON profiles FOR SELECT
    USING (
        contact_email_privacy = 'public'
        OR social_links_privacy = 'public'
    );

CREATE POLICY "Users can read profiles in the same school"
    ON profiles FOR SELECT
    USING (check_same_school(id));

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- user_schools Policies
CREATE POLICY "Users can read own schools"
    ON user_schools FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can read schools of users in the same school"
    ON user_schools FOR SELECT
    USING (check_same_school(user_id));

-- categories Policies
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    USING (true);

-- tags Policies
CREATE POLICY "Tags are viewable by everyone"
    ON tags FOR SELECT
    USING (true);

-- profile_tags Policies
CREATE POLICY "Users can see tags of accessible profiles"
    ON profile_tags FOR SELECT
    USING (
        auth.uid() = profile_id OR
        check_same_school(profile_id)
    );

CREATE POLICY "Users can insert own tags"
    ON profile_tags FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own tags"
    ON profile_tags FOR DELETE
    USING (auth.uid() = profile_id);

-- Trigger for auth.users to create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    email_domain TEXT;
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

    -- Extract domain
    email_domain := split_part(NEW.email, '@', 2);

    -- Insert user_school
    IF email_domain != '' THEN
        INSERT INTO public.user_schools (user_id, school_domain, school_email, is_verified)
        VALUES (NEW.id, email_domain, NEW.email, true);
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger for auth.identities to add additional emails
CREATE OR REPLACE FUNCTION public.handle_new_identity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    identity_email TEXT;
    email_domain TEXT;
    status_type public.school_status;
BEGIN
    identity_email := NEW.identity_data->>'email';

    IF identity_email IS NOT NULL THEN
        email_domain := split_part(identity_email, '@', 2);
        status_type := 'alumni'::public.school_status;

        -- Check if it already exists to avoid unique constraint violation
        IF NOT EXISTS (SELECT 1 FROM public.user_schools WHERE user_id = NEW.user_id AND school_domain = email_domain) THEN
            INSERT INTO public.user_schools (user_id, school_domain, school_email, status, is_verified)
            VALUES (NEW.user_id, email_domain, identity_email, status_type, true);
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_identity_created
    AFTER INSERT ON auth.identities
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_identity();
