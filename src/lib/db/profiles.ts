import { createClient } from '@/lib/supabase/client'

export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

// Profil abrufen
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

// Profil erstellen (nach Signup)
export async function createProfile(userId: string, email: string) {
  const supabase = createClient()

  const { error } = await supabase.from('profiles').insert({
    id: userId,
    email,
  })

  return { error }
}

// Profil aktualisieren
export async function updateProfile(updates: Partial<Profile>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  return { data, error }
}
