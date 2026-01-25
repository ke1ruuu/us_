-- Run this in your Supabase SQL Editor to enable the custom login logic
-- ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS link_data JSONB;

CREATE OR REPLACE FUNCTION public.login_user(p_username text, p_password text)
RETURNS TABLE (session_id uuid, display_name text) 
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path = public, extensions
AS $$
DECLARE
    v_user_id uuid;
    v_display_name text;
    v_session_id uuid;
BEGIN
    -- Use table alias to resolve ambiguity between return column and table column
    SELECT u.id, u.display_name INTO v_user_id, v_display_name
    FROM public.users u
    WHERE u.username = p_username
    AND u.password_hash = crypt(p_password, u.password_hash);

    -- If no match, return nothing
    IF v_user_id IS NULL THEN
        RETURN;
    END IF;

    -- Create a new session for the verified user
    INSERT INTO public.sessions (user_id)
    VALUES (v_user_id)
    RETURNING id INTO v_session_id;

    RETURN QUERY SELECT v_session_id, v_display_name;
END;
$$;

-- Grant execute permission to the anon role (the web server uses this role if not logged in via Supabase Auth)
GRANT EXECUTE ON FUNCTION public.login_user TO anon;
GRANT EXECUTE ON FUNCTION public.login_user TO authenticated;
