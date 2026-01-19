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
