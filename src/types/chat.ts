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
  starred?: boolean;
  isError?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  // Branching support
  parentChatId?: string;
  branchFromIndex?: number; // The message index from which this branch was created
  branchTitle?: string; // Optional custom title for the branch
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

// Project types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  chatCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  color?: string;
}

// Code Snippet types
export interface CodeSnippet {
  id: string;
  userId: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SnippetFormData {
  title: string;
  code: string;
  language: string;
  tags: string[];
}

export const PROJECT_COLORS = [
  { name: 'Rot', value: '#ef4444', bg: 'bg-red-500' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-500' },
  { name: 'Amber', value: '#f59e0b', bg: 'bg-amber-500' },
  { name: 'Grün', value: '#22c55e', bg: 'bg-green-500' },
  { name: 'Cyan', value: '#06b6d4', bg: 'bg-cyan-500' },
  { name: 'Blau', value: '#3b82f6', bg: 'bg-blue-500' },
  { name: 'Lila', value: '#8b5cf6', bg: 'bg-violet-500' },
  { name: 'Pink', value: '#ec4899', bg: 'bg-pink-500' },
  { name: 'Grau', value: '#6b7280', bg: 'bg-gray-500' },
];

export const SNIPPET_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'c', name: 'C', icon: '🔧' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'php', name: 'PHP', icon: '🐘' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
  { id: 'swift', name: 'Swift', icon: '🍎' },
  { id: 'kotlin', name: 'Kotlin', icon: '🤖' },
  { id: 'sql', name: 'SQL', icon: '🗃️' },
  { id: 'html', name: 'HTML', icon: '🌐' },
  { id: 'css', name: 'CSS', icon: '🎨' },
  { id: 'bash', name: 'Bash', icon: '🐚' },
  { id: 'json', name: 'JSON', icon: '📋' },
  { id: 'other', name: 'Other', icon: '📄' },
];

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
