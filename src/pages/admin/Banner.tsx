import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle, Loader2, Image as ImageIcon, Link as LinkIcon, Eye, EyeOff, Users } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  content: string | null;
  created_at: string;
  updated_at: string;
  users?: UserProfile[];
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

const initialForm: Omit<Banner, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  image_url: '',
  link_url: '',
  is_active: true,
  content: '',
  description: '',
  users: [],
};

const AdminBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch banners and users
  useEffect(() => {
    fetchBanners();
    fetchUsers();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select(`
        *,
        users:banner_user_relationship(
          user:profiles!banner_user_relationship_user_id_fkey(
            id,
            email,
            first_name,
            last_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      // Transform the data to match our Banner interface
      const transformedBanners = data?.map(banner => ({
        ...banner,
        users: banner.users?.map((rel: any) => rel.user)
      })) || [];
      setBanners(transformedBanners);
    }
    setLoading(false);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .order('email');
    
    if (!error && data) {
      setUsers(data);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleUserSelect(userId: string) {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  }

  function startEdit(banner: Banner) {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      is_active: banner.is_active,
      content: banner.content || '',
      description: banner.description || '',
      users: banner.users || [],
    });
    setSelectedUsers(banner.users?.map(u => u.id) || []);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
    setSelectedUsers([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.title) {
      setError('Title is required.');
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Update banner
        const { error: bannerError } = await supabase
          .from('banners')
          .update({
            title: form.title,
            image_url: form.image_url || null,
            link_url: form.link_url,
            is_active: form.is_active,
            content: form.content,
            description: form.description,
          })
          .eq('id', editingId);

        if (bannerError) throw bannerError;

        // Update user relationships
        const { error: deleteError } = await supabase
          .from('banner_user_relationship')
          .delete()
          .eq('banner_id', editingId);

        if (deleteError) throw deleteError;

        if (selectedUsers.length > 0) {
          const { error: insertError } = await supabase
            .from('banner_user_relationship')
            .insert(selectedUsers.map(userId => ({
              banner_id: editingId,
              user_id: userId
            })));

          if (insertError) throw insertError;
        }
      } else {
        // Insert new banner
        const { data: newBanner, error: bannerError } = await supabase
          .from('banners')
          .insert([{
            title: form.title,
            image_url: form.image_url || null,
            link_url: form.link_url,
            is_active: form.is_active,
            content: form.content,
            description: form.description,
          }])
          .select()
          .single();

        if (bannerError) throw bannerError;

        if (selectedUsers.length > 0 && newBanner) {
          const { error: insertError } = await supabase
            .from('banner_user_relationship')
            .insert(selectedUsers.map(userId => ({
              banner_id: newBanner.id,
              user_id: userId
            })));

          if (insertError) throw insertError;
        }
      }

      await fetchBanners();
      cancelEdit();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this banner?')) return;
    setLoading(true);
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) setError(error.message);
    else await fetchBanners();
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('banners').upload(fileName, file, { upsert: false });
    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('banners').getPublicUrl(fileName);
    setForm(f => ({ ...f, image_url: publicUrlData.publicUrl }));
    setUploading(false);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-6 h-6" /> Banner Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input input-bordered w-full" placeholder="Banner title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input input-bordered w-full mb-2" placeholder="https://..." />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input file-input-bordered w-full" disabled={uploading} />
          {uploading && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
          {uploadError && <div className="text-xs text-red-600 mt-1">{uploadError}</div>}
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="h-16 w-auto mt-2 rounded shadow border" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Link (optional)</label>
          <input name="link_url" value={form.link_url || ''} onChange={handleChange} className="input input-bordered w-full" placeholder="https://..." />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} id="is_active" className="checkbox" />
          <label htmlFor="is_active" className="text-sm">Active</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea name="content" value={form.content || ''} onChange={handleChange} className="input input-bordered w-full min-h-[80px]" placeholder="Banner content or message..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} className="input input-bordered w-full min-h-[80px]" placeholder="Banner description..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Visible to Users</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
            {users.map(user => (
              <label key={user.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelect(user.id)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">
                  {user.first_name || user.last_name
                    ? `${user.first_name || ''} ${user.last_name || ''}`
                    : user.email}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex gap-2 mt-2">
          <button type="submit" className="btn btn-primary flex items-center gap-1" disabled={loading}>
            {editingId ? <Edit className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            {editingId ? 'Update Banner' : 'Add Banner'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary flex items-center gap-1" onClick={cancelEdit} disabled={loading}>
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          )}
          {loading && <Loader2 className="w-5 h-5 animate-spin ml-2" />}
        </div>
        {error && <div className="text-red-600 col-span-2">{error}</div>}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map(banner => (
              <tr key={banner.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                  {banner.description && (
                    <div className="text-sm text-gray-500">{banner.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {banner.image_url && (
                    <img src={banner.image_url} alt={banner.title} className="h-12 w-auto rounded shadow" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {banner.is_active ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {banner.users?.map(user => (
                      <span key={user.id} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ''} ${user.last_name || ''}`
                          : user.email}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(banner)} className="text-indigo-600 hover:text-indigo-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {banner.link_url && (
                      <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" /> Link
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBanner; 