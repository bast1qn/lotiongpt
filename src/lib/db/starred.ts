import { createClient } from '@/lib/supabase/client';

// Starred messages will be stored in a separate table
// This allows users to star specific messages within their chats

export interface StarredMessage {
  id: string;
  userId: string;
  chatId: string;
  messageIndex: number;
  note?: string;
  createdAt: string;
}

// Get all starred messages for current user
export async function getStarredMessages(): Promise<StarredMessage[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('starred_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching starred messages:', error);
    return [];
  }

  return (data || []).map((s: any) => ({
    id: s.id,
    userId: s.user_id,
    chatId: s.chat_id,
    messageIndex: s.message_index,
    note: s.note,
    createdAt: s.created_at,
  }));
}

// Check if a specific message is starred
export async function isMessageStarred(chatId: string, messageIndex: number): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from('starred_messages')
    .select('id')
    .eq('user_id', user.id)
    .eq('chat_id', chatId)
    .eq('message_index', messageIndex)
    .single();

  return !error && !!data;
}

// Star a message
export async function starMessage(chatId: string, messageIndex: number, note?: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('starred_messages')
    .insert({
      user_id: user.id,
      chat_id: chatId,
      message_index: messageIndex,
      note: note || null,
    });

  if (error) {
    console.error('Error starring message:', error);
    return false;
  }

  return true;
}

// Unstar a message
export async function unstarMessage(chatId: string, messageIndex: number): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('starred_messages')
    .delete()
    .eq('user_id', user.id)
    .eq('chat_id', chatId)
    .eq('message_index', messageIndex);

  if (error) {
    console.error('Error unstarring message:', error);
    return false;
  }

  return true;
}

// Toggle star status
export async function toggleMessageStar(chatId: string, messageIndex: number): Promise<boolean> {
  const starred = await isMessageStarred(chatId, messageIndex);

  if (starred) {
    return await unstarMessage(chatId, messageIndex);
  } else {
    return await starMessage(chatId, messageIndex);
  }
}

// Get starred message indices for a specific chat
export async function getStarredIndicesForChat(chatId: string): Promise<number[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('starred_messages')
    .select('message_index')
    .eq('user_id', user.id)
    .eq('chat_id', chatId);

  if (error) {
    console.error('Error fetching starred indices:', error);
    return [];
  }

  return (data || []).map((s: any) => s.message_index);
}
