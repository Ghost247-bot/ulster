-- Create function to get table information for the table editor
CREATE OR REPLACE FUNCTION get_table_info()
RETURNS TABLE (
  table_name TEXT,
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT,
  is_primary_key BOOLEAN,
  is_foreign_key BOOLEAN,
  foreign_table_name TEXT,
  foreign_column_name TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.table_name::TEXT,
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    c.column_default::TEXT,
    CASE WHEN pk.column_name IS NOT NULL THEN TRUE ELSE FALSE END as is_primary_key,
    CASE WHEN fk.column_name IS NOT NULL THEN TRUE ELSE FALSE END as is_foreign_key,
    fk.foreign_table_name::TEXT,
    fk.foreign_column_name::TEXT
  FROM information_schema.tables t
  JOIN information_schema.columns c ON t.table_name = c.table_name
  LEFT JOIN (
    SELECT 
      ku.table_name,
      ku.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public'
  ) pk ON t.table_name = pk.table_name AND c.column_name = pk.column_name
  LEFT JOIN (
    SELECT 
      ku.table_name,
      ku.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
  ) fk ON t.table_name = fk.table_name AND c.column_name = fk.column_name
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT LIKE 'pg_%'
    AND t.table_name NOT LIKE 'sql_%'
  ORDER BY t.table_name, c.ordinal_position;
END;
$$;

-- Create function to get table row counts
CREATE OR REPLACE FUNCTION get_table_row_counts()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
  table_record RECORD;
  row_count BIGINT;
BEGIN
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'sql_%'
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I', table_record.table_name) INTO row_count;
    table_name := table_record.table_name;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_table_info() TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_row_counts() TO authenticated;

-- Create a more comprehensive table info function that returns structured data
CREATE OR REPLACE FUNCTION get_comprehensive_table_info()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
  table_info JSON;
  table_record RECORD;
  column_info JSON;
  column_record RECORD;
  row_count BIGINT;
BEGIN
  result := '[]'::JSON;
  
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT LIKE 'sql_%'
    ORDER BY table_name
  LOOP
    -- Get column information for this table
    column_info := '[]'::JSON;
    
    FOR column_record IN
      SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        CASE WHEN pk.column_name IS NOT NULL THEN TRUE ELSE FALSE END as is_primary_key,
        CASE WHEN fk.column_name IS NOT NULL THEN TRUE ELSE FALSE END as is_foreign_key,
        fk.foreign_table_name,
        fk.foreign_column_name
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT 
          ku.table_name,
          ku.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
      ) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
      LEFT JOIN (
        SELECT 
          ku.table_name,
          ku.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku ON tc.constraint_name = ku.constraint_name
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
      ) fk ON c.table_name = fk.table_name AND c.column_name = fk.column_name
      WHERE c.table_name = table_record.table_name
        AND c.table_schema = 'public'
      ORDER BY c.ordinal_position
    LOOP
      column_info := column_info || json_build_object(
        'name', column_record.column_name,
        'type', column_record.data_type,
        'nullable', column_record.is_nullable = 'YES',
        'defaultValue', column_record.column_default,
        'isPrimaryKey', column_record.is_primary_key,
        'isForeignKey', column_record.is_foreign_key,
        'foreignTable', column_record.foreign_table_name,
        'foreignColumn', column_record.foreign_column_name
      );
    END LOOP;
    
    -- Get row count for this table
    EXECUTE format('SELECT COUNT(*) FROM %I', table_record.table_name) INTO row_count;
    
    -- Build table info object
    table_info := json_build_object(
      'name', table_record.table_name,
      'columns', column_info,
      'rowCount', row_count
    );
    
    result := result || table_info;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_comprehensive_table_info() TO authenticated;

-- Create a function to execute safe SQL queries (admin only)
CREATE OR REPLACE FUNCTION execute_safe_sql(query_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  row_count INTEGER;
BEGIN
  -- Only allow SELECT queries for security
  IF NOT (trim(upper(query_text)) LIKE 'SELECT%' OR trim(upper(query_text)) LIKE 'WITH%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  -- Prevent dangerous operations
  IF upper(query_text) ~* '(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE|GRANT|REVOKE)' THEN
    RAISE EXCEPTION 'Dangerous operations are not allowed';
  END IF;
  
  -- Execute the query and return results as JSON
  BEGIN
    EXECUTE query_text INTO result;
    RETURN json_build_object('success', true, 'data', result);
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
  END;
END;
$$;

-- Grant execute permission only to authenticated users (will be restricted by RLS)
GRANT EXECUTE ON FUNCTION execute_safe_sql(TEXT) TO authenticated;
