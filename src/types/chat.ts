export type FileType = 'image' | 'document' | 'code' | 'data' | 'audio' | 'other';

export interface ImageAttachment {
  type: 'image';
  data: string; // base64 encoded
  mimeType: string;
  name?: string;
  size?: number;
}

export interface FileAttachment {
  type: FileType;
  data: string; // base64 encoded
  mimeType: string;
  name: string;
  size: number;
  url?: string; // For large files stored externally
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: ImageAttachment[];
  files?: FileAttachment[];
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

// File type configurations
export const FILE_TYPE_CONFIGS: Record<FileType, {
  extensions: string[];
  maxSize: number; // in bytes
  mimeTypes: string[];
  icon: string;
  color: string;
}> = {
  image: {
    extensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
    maxSize: 10 * 1024 * 1024, // 10 MB
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp'],
    icon: '🖼️',
    color: 'text-purple-500',
  },
  document: {
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'],
    maxSize: 25 * 1024 * 1024, // 25 MB
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'],
    icon: '📄',
    color: 'text-blue-500',
  },
  code: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.cs', '.go', '.rs', '.php', '.rb', '.swift', '.kt', '.sql', '.html', '.css', '.scss', '.json', '.xml', '.yaml', '.yml', '.sh', '.bash'],
    maxSize: 5 * 1024 * 1024, // 5 MB
    mimeTypes: ['text/javascript', 'text/typescript', 'text/x-python', 'text/x-java-source', 'text/x-c', 'text/x-c++', 'application/json', 'text/html', 'text/css'],
    icon: '💻',
    color: 'text-green-500',
  },
  data: {
    extensions: ['.csv', '.xls', '.xlsx', '.json', '.xml'],
    maxSize: 10 * 1024 * 1024, // 10 MB
    mimeTypes: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json', 'text/xml'],
    icon: '📊',
    color: 'text-orange-500',
  },
  audio: {
    extensions: ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'],
    maxSize: 25 * 1024 * 1024, // 25 MB
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/flac'],
    icon: '🎵',
    color: 'text-pink-500',
  },
  other: {
    extensions: [],
    maxSize: 5 * 1024 * 1024, // 5 MB
    mimeTypes: [],
    icon: '📎',
    color: 'text-gray-500',
  },
};

export function getFileType(file: File): FileType {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();

  for (const [type, config] of Object.entries(FILE_TYPE_CONFIGS)) {
    if (config.extensions.includes(ext) || config.mimeTypes.includes(file.type)) {
      return type as FileType;
    }
  }

  return 'other';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function isFileAllowed(file: File): { allowed: boolean; reason?: string } {
  const fileType = getFileType(file);
  const config = FILE_TYPE_CONFIGS[fileType];

  if (file.size > config.maxSize) {
    return {
      allowed: false,
      reason: `Datei zu groß (max ${formatFileSize(config.maxSize)})`,
    };
  }

  return { allowed: true };
}
