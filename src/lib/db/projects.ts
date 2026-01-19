import { createClient } from '@/lib/supabase/client';
import type { Project, ProjectFormData } from '@/types/chat';
import { PROJECT_COLORS } from '@/types/chat';

// Get all projects for current user
export async function fetchProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*, chats(count)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    userId: p.user_id,
    name: p.name,
    description: p.description,
    color: p.color || PROJECT_COLORS[0].value,
    chatCount: p.chats?.[0]?.count || 0,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}

// Create a new project
export async function createProject(formData: ProjectFormData): Promise<Project | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      color: formData.color || PROJECT_COLORS[0].value,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description,
    color: data.color,
    chatCount: 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update an existing project
export async function updateProject(id: string, formData: ProjectFormData): Promise<Project | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('projects')
    .update({
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      color: formData.color,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    description: data.description,
    color: data.color,
    chatCount: 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Delete a project
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

// Add chat to project
export async function addChatToProject(chatId: string, projectId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('chats')
    .update({ project_id: projectId })
    .eq('id', chatId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error adding chat to project:', error);
    return false;
  }

  return true;
}

// Remove chat from project
export async function removeChatFromProject(chatId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('chats')
    .update({ project_id: null })
    .eq('id', chatId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error removing chat from project:', error);
    return false;
  }

  return true;
}
