import { createClient } from '@/lib/supabase/client';

export interface Artifact {
  id: string;
  userId: string;
  chatId: string;
  name: string;
  content: string;
  fileType: string;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtifactFormData {
  name: string;
  content: string;
  fileType: string;
  language?: string;
}

export const ARTIFACT_FILE_TYPES = [
  { id: 'html', name: 'HTML', icon: '🌐', mimeType: 'text/html' },
  { id: 'css', name: 'CSS', icon: '🎨', mimeType: 'text/css' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', mimeType: 'text/javascript' },
  { id: 'typescript', name: 'TypeScript', icon: '📘', mimeType: 'text/typescript' },
  { id: 'python', name: 'Python', icon: '🐍', mimeType: 'text/x-python' },
  { id: 'json', name: 'JSON', icon: '📋', mimeType: 'application/json' },
  { id: 'markdown', name: 'Markdown', icon: '📝', mimeType: 'text/markdown' },
  { id: 'svg', name: 'SVG', icon: '🖼️', mimeType: 'image/svg+xml' },
  { id: 'txt', name: 'Text', icon: '📄', mimeType: 'text/plain' },
];

// Get all artifacts for current user
export async function fetchArtifacts(): Promise<Artifact[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching artifacts:', error);
    return [];
  }

  return (data || []).map((a: any) => ({
    id: a.id,
    userId: a.user_id,
    chatId: a.chat_id,
    name: a.name,
    content: a.content,
    fileType: a.file_type,
    language: a.language,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }));
}

// Get artifacts for a specific chat
export async function fetchArtifactsForChat(chatId: string): Promise<Artifact[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', user.id)
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat artifacts:', error);
    return [];
  }

  return (data || []).map((a: any) => ({
    id: a.id,
    userId: a.user_id,
    chatId: a.chat_id,
    name: a.name,
    content: a.content,
    fileType: a.file_type,
    language: a.language,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }));
}

// Create a new artifact
export async function createArtifact(formData: ArtifactFormData, chatId: string): Promise<Artifact | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('artifacts')
    .insert({
      user_id: user.id,
      chat_id: chatId,
      name: formData.name.trim(),
      content: formData.content,
      file_type: formData.fileType,
      language: formData.language || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating artifact:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    chatId: data.chat_id,
    name: data.name,
    content: data.content,
    fileType: data.file_type,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update an existing artifact
export async function updateArtifact(id: string, formData: ArtifactFormData): Promise<Artifact | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('artifacts')
    .update({
      name: formData.name.trim(),
      content: formData.content,
      file_type: formData.fileType,
      language: formData.language || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating artifact:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    chatId: data.chat_id,
    name: data.name,
    content: data.content,
    fileType: data.file_type,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Delete an artifact
export async function deleteArtifact(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('artifacts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting artifact:', error);
    return false;
  }

  return true;
}

// Download artifact as file
export function downloadArtifact(artifact: Artifact) {
  const typeInfo = ARTIFACT_FILE_TYPES.find(t => t.id === artifact.fileType);
  const mimeType = typeInfo?.mimeType || 'text/plain';
  const extension = artifact.fileType === 'typescript' ? 'ts' : artifact.fileType;

  const blob = new Blob([artifact.content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${artifact.name}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
