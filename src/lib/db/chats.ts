import { createClient } from '@/lib/supabase/client'
import type { Chat, Message } from '@/types/chat'
import { generateId } from '@/lib/utils'

// Type für Supabase Chat Row
type SupabaseChat = {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

// Chats für einen User abrufen
export async function fetchChats(): Promise<Chat[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('chats')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (!data) return []

  // Für jeden Chat die Messages laden
  const chatsWithMessages = await Promise.all(
    data.map(async (chat: SupabaseChat) => {
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true })

      const messages: Message[] = (messagesData || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        images: msg.images,
      }))

      return {
        id: chat.id,
        title: chat.title,
        messages,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
      }
    })
  )

  return chatsWithMessages
}

// Neuen Chat erstellen
export async function createChat(title: string): Promise<Chat> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('chats')
    .insert({
      user_id: user.id,
      title,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    title: data.title,
    messages: [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// Chat aktualisieren (neue Messages hinzufügen)
export async function updateChat(chatId: string, messages: Message[], title?: string): Promise<Chat> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  // Chat updaten
  const { data: chatData, error: chatError } = await supabase
    .from('chats')
    .update({
      updated_at: new Date().toISOString(),
      ...(title && { title }),
    })
    .eq('id', chatId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (chatError) throw chatError

  // Messages speichern (lösche alte, füge neue hinzu)
  await supabase.from('messages').delete().eq('chat_id', chatId)

  for (const message of messages) {
    await supabase.from('messages').insert({
      chat_id: chatId,
      role: message.role,
      content: message.content,
      images: message.images || null,
    })
  }

  // Messages neu laden
  const { data: messagesData } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  const messages: Message[] = (messagesData || []).map((msg: any) => ({
    role: msg.role,
    content: msg.content,
    images: msg.images,
  }))

  return {
    id: chatData.id,
    title: chatData.title,
    messages,
    createdAt: chatData.created_at,
    updatedAt: chatData.updated_at,
  }
}

// Chat löschen
export async function deleteChat(chatId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId)
    .eq('user_id', user.id)

  if (error) throw error
}

// Einzelnen Chat abrufen
export async function fetchChat(chatId: string): Promise<Chat | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('chats')
    .select('*')
    .eq('id', chatId)
    .eq('user_id', user.id)
    .single()

  if (!data) return null

  const { data: messagesData } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })

  const messages: Message[] = (messagesData || []).map((msg: any) => ({
    role: msg.role,
    content: msg.content,
    images: msg.images,
  }))

  return {
    id: data.id,
    title: data.title,
    messages,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
