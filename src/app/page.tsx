'use client';

import { useState, useEffect } from 'react';
import { Chat, Message, ImageAttachment } from '@/types/chat';
import { storage } from '@/lib/storage';
import { truncateTitle } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { Icons } from '@/components/Icons';

export default function Home() {
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const chats = storage.getChats();
    if (chats.length > 0) {
      setCurrentChat(chats[0]);
    } else {
      handleNewChat();
    }
  }, []);

  const handleNewChat = () => {
    const newChat = storage.createChat();
    setCurrentChat(newChat);
    setSidebarOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    const chat = storage.getChat(chatId);
    if (chat) {
      setCurrentChat(chat);
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
    storage.saveChat(updatedChat);
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

      setCurrentChat(finalChat);
      storage.saveChat(finalChat);
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
      storage.saveChat(errorChat);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <Sidebar
        currentChatId={currentChat?.id || null}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
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
