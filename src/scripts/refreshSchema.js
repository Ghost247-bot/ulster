import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function refreshSchema() {
  try {
    // Make a query to refresh the schema cache including the relationship
    const { data, error } = await supabase
      .from('banners')
      .select(`
        id,
        title,
        image_url,
        link_url,
        is_active,
        content,
        created_at,
        users:banner_user_relationship(
          user:profiles!banner_user_relationship_user_id_fkey(
            id
          )
        )
      `)
      .limit(1);

    if (error) {
      console.error('Error refreshing schema:', error);
      return;
    }

    console.log('Schema cache refreshed successfully');
  } catch (err) {
    console.error('Error:', err);
  }
}

// Execute the refresh
refreshSchema(); 