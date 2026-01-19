import { Chat, Message } from '@/types/chat';

const CHATS_KEY = 'lotiongpt_chats';
const SETTINGS_KEY = 'lotiongpt_settings';

export interface Settings {
  apiKey: string;
  model: string;
  visionModel: string;
  temperature: number;
  maxTokens: number;
  thinking: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  apiKey: 'b6f5c430caa24818a04ad788a0f2f479.1CdsacXynCYJEhx6',
  model: 'glm-4.6',
  visionModel: 'glm-4.6v-flashx',
  temperature: 0.7,
  maxTokens: 4096,
  thinking: true,
};

export const storage = {
  // Chats
  getChats(): Chat[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CHATS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveChats(chats: Chat[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  },

  getChat(id: string): Chat | undefined {
    return this.getChats().find(c => c.id === id);
  },

  saveChat(chat: Chat): void {
    const chats = this.getChats();
    const index = chats.findIndex(c => c.id === chat.id);
    if (index >= 0) {
      chats[index] = chat;
    } else {
      chats.unshift(chat);
    }
    this.saveChats(chats);
  },

  createChat(title = 'Neuer Chat'): Chat {
    const chat: Chat = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveChat(chat);
    return chat;
  },

  // Branching
  createBranch(
    parentChat: Chat,
    fromIndex: number,
    branchTitle?: string
  ): Chat {
    // Messages up to and including the branch point
    const branchMessages = parentChat.messages.slice(0, fromIndex + 1);

    const chat: Chat = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: branchTitle || `${parentChat.title} (Branch)`,
      messages: branchMessages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentChatId: parentChat.id,
      branchFromIndex: fromIndex,
    };
    this.saveChat(chat);
    return chat;
  },

  getBranches(parentChatId: string): Chat[] {
    return this.getChats().filter(c => c.parentChatId === parentChatId);
  },

  deleteChat(id: string): void {
    // First, delete all branches of this chat
    const branches = this.getBranches(id);
    branches.forEach(branch => this.deleteChat(branch.id));

    // Then delete the chat itself
    const chats = this.getChats().filter(c => c.id !== id);
    this.saveChats(chats);
  },

  // Settings
  getSettings(): Settings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<Settings>): void {
    if (typeof window === 'undefined') return;
    const current = this.getSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  },
};
