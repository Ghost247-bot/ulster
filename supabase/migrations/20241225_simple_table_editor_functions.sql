-- Simple table editor functions that don't require admin privileges
-- These functions provide basic table information for the table editor

-- Create a simple function to get basic table information
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
SECURITY DEFINER
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

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_table_info() TO authenticated;

-- Create a simple function to get table row counts
CREATE OR REPLACE FUNCTION get_table_row_counts()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
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
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I', table_record.table_name) INTO row_count;
      table_name := table_record.table_name;
      row_count := row_count;
      RETURN NEXT;
    EXCEPTION WHEN OTHERS THEN
      -- Skip tables that can't be accessed
      CONTINUE;
    END;
  END LOOP;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_table_row_counts() TO authenticated;

-- Add comment to document the functions
COMMENT ON FUNCTION get_table_info() IS 'Returns basic table and column information for the table editor';
COMMENT ON FUNCTION get_table_row_counts() IS 'Returns row counts for all accessible tables';
