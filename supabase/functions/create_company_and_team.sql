CREATE OR REPLACE FUNCTION create_company_and_team(p_company_name TEXT, p_user_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id UUID;
    v_team_id UUID;
BEGIN
    -- Check if user already has a team
    IF EXISTS (
        SELECT 1 FROM team_members 
        WHERE user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'User already belongs to a team';
    END IF;

    -- Create company
    INSERT INTO companies (name)
    VALUES (p_company_name)
    RETURNING id INTO v_company_id;

    -- Create team
    INSERT INTO teams (name, company_id)
    VALUES (p_company_name || ' Team', v_company_id)
    RETURNING id INTO v_team_id;

    -- Add user as admin
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (v_team_id, p_user_id, 'admin');

    RETURN json_build_object(
        'company_id', v_company_id,
        'team_id', v_team_id
    );
END;
$$;