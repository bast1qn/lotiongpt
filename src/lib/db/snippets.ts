import { createClient } from '@/lib/supabase/client';
import type { CodeSnippet, SnippetFormData } from '@/types/chat';

// Get all snippets for current user
export async function fetchSnippets(): Promise<CodeSnippet[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching snippets:', error);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    userId: s.user_id,
    title: s.title,
    code: s.code,
    language: s.language,
    tags: s.tags || [],
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));
}

// Create a new snippet
export async function createSnippet(formData: SnippetFormData): Promise<CodeSnippet | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('snippets')
    .insert({
      user_id: user.id,
      title: formData.title.trim(),
      code: formData.code,
      language: formData.language,
      tags: formData.tags || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating snippet:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    code: data.code,
    language: data.language,
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update an existing snippet
export async function updateSnippet(id: string, formData: SnippetFormData): Promise<CodeSnippet | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('snippets')
    .update({
      title: formData.title.trim(),
      code: formData.code,
      language: formData.language,
      tags: formData.tags || [],
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating snippet:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    code: data.code,
    language: data.language,
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Delete a snippet
export async function deleteSnippet(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('snippets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting snippet:', error);
    return false;
  }

  return true;
}

// Search snippets by query
export async function searchSnippets(query: string): Promise<CodeSnippet[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .eq('user_id', user.id)
    .or(`title.ilike.%${query}%,code.ilike.%${query}%,tags.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error searching snippets:', error);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    userId: s.user_id,
    title: s.title,
    code: s.code,
    language: s.language,
    tags: s.tags || [],
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));
}
