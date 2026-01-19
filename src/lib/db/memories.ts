import { createClient } from '@/lib/supabase/client';
import type { Memory, MemoryFormData, MemoryCategory } from '@/types/chat';

// Get all memories for current user
export async function fetchMemories(): Promise<Memory[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching memories:', error);
    return [];
  }

  return (data || []).map(m => ({
    id: m.id,
    userId: m.user_id,
    key: m.key,
    value: m.value,
    category: m.category,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }));
}

// Get memories formatted for AI context
export async function getMemoriesForContext(): Promise<string> {
  const memories = await fetchMemories();

  if (memories.length === 0) return '';

  const memoryText = memories
    .map(m => `- ${m.key}: ${m.value}`)
    .join('\n');

  return `User information to remember:\n${memoryText}`;
}

// Create a new memory
export async function createMemory(formData: MemoryFormData): Promise<Memory | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('memories')
    .insert({
      user_id: user.id,
      key: formData.key.trim(),
      value: formData.value.trim(),
      category: formData.category,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating memory:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    key: data.key,
    value: data.value,
    category: data.category,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update an existing memory
export async function updateMemory(id: string, formData: MemoryFormData): Promise<Memory | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('memories')
    .update({
      key: formData.key.trim(),
      value: formData.value.trim(),
      category: formData.category,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating memory:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    key: data.key,
    value: data.value,
    category: data.category,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Delete a memory
export async function deleteMemory(id: string): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting memory:', error);
    return false;
  }

  return true;
}

// Extract potential memories from a message using AI
export async function extractMemoriesFromMessage(userMessage: string, aiResponse: string): Promise<MemoryFormData[]> {
  // Check if the user is asking to remember something
  const rememberKeywords = [
    'merk dir', 'merke dir', 'merke',
    'remember', 'remember that',
    'speicher', 'speichere',
    'notier', 'notiere',
    'save', 'save that'
  ];

  const shouldRemember = rememberKeywords.some(keyword =>
    userMessage.toLowerCase().includes(keyword)
  );

  if (!shouldRemember) return [];

  // Try to extract key-value pairs from the context
  const extractedMemories: MemoryFormData[] = [];

  // Common patterns for personal information
  const patterns = [
    // Name patterns
    { regex: /(?:ich heiße|mein name ist|i am|my name is)\s+([a-zA-Z]+)/i, key: 'name', category: 'personal' as MemoryCategory },
    // Birthday patterns
    { regex: /(?:geburtstag|birthday|geboren)\s+(?:am|on)?\s*(\d{1,2}\.\d{1,2}\.\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\.\s*[A-Za-z]+\s*\d{4})/i, key: 'birthday', category: 'personal' as MemoryCategory },
    // Location patterns
    { regex: /(?:ich wohne in|wohne in|i live in|live in)\s+([a-zA-Z\s]+)/i, key: 'location', category: 'context' as MemoryCategory },
    // Language patterns
    { regex: /(?:sprichst|sprechen)\s+(?:deutsch|englisch|french|spanish|german|english)/i, key: 'language', category: 'preferences' as MemoryCategory },
  ];

  for (const pattern of patterns) {
    const match = userMessage.match(pattern.regex);
    if (match) {
      extractedMemories.push({
        key: pattern.key,
        value: match[1].trim(),
        category: pattern.category,
      });
    }
  }

  return extractedMemories;
}

// Get memory suggestions from AI response
export async function getSuggestedMemories(userMessage: string, aiResponse: string): Promise<MemoryFormData[]> {
  // If AI response indicates it learned something about the user
  const suggestions: MemoryFormData[] = [];

  // Look for phrases in AI response that suggest information was learned
  const learnedPatterns = [
    { regex: /Ich habe (?:jetzt )?gelernt, dass (?:du )?([\w\s]+) (?:ist|bist)\s+([^.]+)\./i, keyIndex: 1, valueIndex: 2 },
    { regex: /Ich (?:werde )?merken, dass (?:du )?([\w\s]+) (?:ist|bist)\s+([^.]+)\./i, keyIndex: 1, valueIndex: 2 },
    { regex: /Notiert: ([\w\s]+) = ([^.]+)/i, keyIndex: 1, valueIndex: 2 },
  ];

  for (const pattern of learnedPatterns) {
    const match = aiResponse.match(pattern.regex);
    if (match) {
      suggestions.push({
        key: match[pattern.keyIndex].trim(),
        value: match[pattern.valueIndex].trim(),
        category: 'personal',
      });
    }
  }

  return suggestions;
}
