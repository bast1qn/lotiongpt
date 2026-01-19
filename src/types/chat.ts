export interface ImageAttachment {
  type: 'image';
  data: string; // base64 encoded
  mimeType: string;
  name?: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: ImageAttachment[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  thinking?: boolean;
}

export interface ChatResponse {
  content: string;
  model?: string;
}

export type MemoryCategory = 'personal' | 'preferences' | 'context' | 'other';

export interface Memory {
  id: string;
  userId: string;
  key: string;        // e.g. "birthday", "name", "preferred_language"
  value: string;      // e.g. "15.03.1990", "Max", "German"
  category: MemoryCategory;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryFormData {
  key: string;
  value: string;
  category: MemoryCategory;
}
