import { supabase } from '../lib/supabase';

async function refreshSchema() {
  try {
    // Make a simple query to refresh the schema cache
    const { data, error } = await supabase
      .from('banners')
      .select('id, title, image_url, link_url, is_active, content, user_id, created_at')
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

refreshSchema(); 