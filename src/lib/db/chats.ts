import { createClient } from '@/lib/supabase/client'
import type { Chat, Message } from '@/types/chat'
import { generateId } from '@/lib/utils'

// Type für Supabase Chat Row mit Messages (JOIN)
type SupabaseChatWithMessages = {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages?: Array<{
    id: string
    chat_id: string
    role: string
    content: string
    images: any
    created_at: string
  }>
}

// Chats für einen User abrufen (mit JOIN - keine N+1 Queries mehr)
export async function fetchChats(): Promise<Chat[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Optimierte Query mit JOIN - einzige Query für alle Daten
  const { data, error } = await supabase
    .from('chats')
    .select(`
      id,
      user_id,
      title,
      created_at,
      updated_at,
      messages (
        id,
        chat_id,
        role,
        content,
        images,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error || !data) return []

  // Transformiere die Daten in das erwartete Format
  return data.map((chat: SupabaseChatWithMessages) => ({
    id: chat.id,
    title: chat.title,
    createdAt: chat.created_at,
    updatedAt: chat.updated_at,
    messages: (chat.messages || [])
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((msg): Message => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        images: msg.images,
      }))
  }))
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

  // Bulk insert für bessere Performance
  if (messages.length > 0) {
    const messagesToInsert = messages.map(msg => ({
      chat_id: chatId,
      role: msg.role,
      content: msg.content,
      images: msg.images || null,
    }))

    const { error: insertError } = await supabase
      .from('messages')
      .insert(messagesToInsert)

    if (insertError) throw insertError
  }

  // Chat neu laden mit optimierter Query
  return fetchChat(chatId) as Promise<Chat>
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

// Einzelnen Chat abrufen (optimiert mit JOIN)
export async function fetchChat(chatId: string): Promise<Chat | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Optimierte Query mit JOIN
  const { data, error } = await supabase
    .from('chats')
    .select(`
      id,
      user_id,
      title,
      created_at,
      updated_at,
      messages (
        id,
        chat_id,
        role,
        content,
        images,
        created_at
      )
    `)
    .eq('id', chatId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    messages: (data.messages || [])
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((msg): Message => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        images: msg.images,
      }))
  }
}
