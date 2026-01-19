'use client';

import { useState, useEffect } from 'react';
import { Chat, Message, ImageAttachment } from '@/types/chat';
import { truncateTitle } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { Icons } from '@/components/Icons';
import { AuthGuard } from '@/components/AuthGuard';
import { fetchChats, createChat, updateChat, deleteChat, fetchChat } from '@/lib/db/chats';
import { getMemoriesForContext, extractMemoriesFromMessage, createMemory } from '@/lib/db/memories';
import { storage } from '@/lib/storage';

function HomeContent() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  // Chats von Supabase laden
  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const loadedChats = await fetchChats();
      setChats(loadedChats);
      if (loadedChats.length > 0 && !currentChat) {
        setCurrentChat(loadedChats[0]);
      } else if (loadedChats.length === 0 && !currentChat) {
        // Neuen Chat erstellen wenn keiner da ist
        handleNewChat();
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      // Fallback auf localStorage wenn Supabase fehlschlägt
      const localChats = storage.getChats();
      setChats(localChats);
      if (localChats.length > 0) {
        setCurrentChat(localChats[0]);
      }
    } finally {
      setIsLoadingChats(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleNewChat = async () => {
    try {
      const newChat = await createChat('Neuer Chat');

      // Inject memories as system message for new chats
      const memoriesContext = await getMemoriesForContext();
      if (memoriesContext) {
        const systemMessage: Message = { role: 'system', content: memoriesContext };
        newChat.messages = [systemMessage];
        await updateChat(newChat.id, newChat.messages, newChat.title);
      }

      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error creating chat:', error);
      // Fallback auf localStorage
      const localNewChat = storage.createChat();
      setChats((prev) => [localNewChat, ...prev]);
      setCurrentChat(localNewChat);
    }
  };

  const handleChatSelect = async (chatId: string) => {
    const existingChat = chats.find(c => c.id === chatId);
    if (existingChat) {
      setCurrentChat(existingChat);
    } else {
      // Chat von Supabase laden
      try {
        const loadedChat = await fetchChat(chatId);
        if (loadedChat) {
          setCurrentChat(loadedChat);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      }
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter(c => c.id !== chatId));
      if (currentChat?.id === chatId) {
        const remaining = chats.filter(c => c.id !== chatId);
        if (remaining.length > 0) {
          setCurrentChat(remaining[0]);
        } else {
          await handleNewChat();
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      // Fallback auf localStorage
      storage.deleteChat(chatId);
      const localChats = storage.getChats();
      setChats(localChats);
    }
  };

  const handleSendMessage = async (content: string, images?: ImageAttachment[]) => {
    if (!currentChat || isLoading) return;

    const userMessage: Message = { role: 'user', content, images };
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updatedAt: new Date().toISOString(),
    };

    if (updatedChat.messages.length === 1) {
      updatedChat.title = truncateTitle(content);
    }

    setCurrentChat(updatedChat);
    setIsLoading(true);

    try {
      const settings = storage.getSettings();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.apiKey,
        },
        body: JSON.stringify({
          messages: updatedChat.messages,
          model: settings.model,
          visionModel: settings.visionModel,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          thinking: settings.thinking,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const data = await response.json();

      const finalChat: Chat = {
        ...updatedChat,
        messages: [
          ...updatedChat.messages,
          { role: 'assistant', content: data.content },
        ],
        updatedAt: new Date().toISOString(),
      };

      // Extract memories from the conversation
      const extractedMemories = await extractMemoriesFromMessage(content, data.content);
      for (const memory of extractedMemories) {
        await createMemory(memory);
      }

      // In Supabase speichern
      await updateChat(finalChat.id, finalChat.messages, finalChat.title);

      setCurrentChat(finalChat);
      setChats((prev) =>
        prev.map((c) => (c.id === finalChat.id ? finalChat : c))
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const errorChat: Chat = {
        ...updatedChat,
        messages: [
          ...updatedChat.messages,
          { role: 'assistant', content: `Fehler: ${error instanceof Error ? error.message : 'Unknown error'}` },
        ],
        updatedAt: new Date().toISOString(),
      };
      setCurrentChat(errorChat);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (isLoadingChats) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)] flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-[var(--color-text-muted)]">Lade Chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Sidebar
        currentChatId={currentChat?.id || null}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        chats={chats}
        onRefreshChats={loadChats}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full min-w-0 bg-[var(--color-bg-primary)]">
        <header className="flex-shrink-0 flex items-center gap-4 px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-200"
          >
            <Icons.Menu />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary-500)] animate-pulse" />
            <h1 className="text-sm font-medium text-[var(--color-text-secondary)]">
              {currentChat?.title || 'Neuer Chat'}
            </h1>
          </div>
        </header>

        <MessageList
          messages={currentChat?.messages || []}
          isLoading={isLoading}
          onSuggestionClick={handleSuggestionClick}
        />

        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
