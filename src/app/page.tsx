'use client';

import { useState, useEffect, useCallback } from 'react';
import { Chat, Message, ImageAttachment, FileAttachment } from '@/types/chat';
import { truncateTitle } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { ChatInput, ChatModel } from '@/components/ChatInput';
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

  // New states for enhanced features
  const [selectedModel, setSelectedModel] = useState<ChatModel>('glm-4.7');
  const [thinkingEnabled, setThinkingEnabled] = useState(true);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Load chats from Supabase
  const loadChats = async () => {
    setIsLoadingChats(true);
    try {
      const loadedChats = await fetchChats();
      setChats(loadedChats);
      if (loadedChats.length > 0 && !currentChat) {
        setCurrentChat(loadedChats[0]);
      } else if (loadedChats.length === 0 && !currentChat) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Error loading chats:', error);
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
      storage.deleteChat(chatId);
      const localChats = storage.getChats();
      setChats(localChats);
    }
  };

  const sendMessageToAPI = async (messages: Message[]): Promise<string> => {
    const settings = storage.getSettings();

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
      },
      body: JSON.stringify({
        messages,
        model: selectedModel,
        visionModel: settings.visionModel,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        thinking: thinkingEnabled,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    const data = await response.json();
    return data.content;
  };

  const handleSendMessage = async (content: string, images?: ImageAttachment[], files?: FileAttachment[]) => {
    if (!currentChat || isLoading) return;

    const userMessage: Message = { role: 'user', content, images, files };
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updatedAt: new Date().toISOString(),
    };

    if (updatedChat.messages.filter(m => m.role === 'user').length === 1) {
      updatedChat.title = truncateTitle(content);
    }

    setCurrentChat(updatedChat);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAPI(updatedChat.messages);

      const finalChat: Chat = {
        ...updatedChat,
        messages: [
          ...updatedChat.messages,
          { role: 'assistant', content: aiResponse },
        ],
        updatedAt: new Date().toISOString(),
      };

      const extractedMemories = await extractMemoriesFromMessage(content, aiResponse);
      for (const memory of extractedMemories) {
        await createMemory(memory);
      }

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

  const handleRegenerate = useCallback(async () => {
    if (!currentChat || currentChat.messages.length === 0 || isLoading) return;

    // Get messages up to and including the last user message
    const messages = [...currentChat.messages];
    const lastMessage = messages[messages.length - 1];

    // Only regenerate if last message is from assistant
    if (lastMessage.role !== 'assistant') return;

    // Remove the last assistant message to regenerate
    const messagesForRegeneration = messages.slice(0, -1);

    setCurrentChat({
      ...currentChat,
      messages: messagesForRegeneration,
    });

    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAPI(messagesForRegeneration);

      const finalChat: Chat = {
        ...currentChat,
        messages: [
          ...messagesForRegeneration,
          { role: 'assistant', content: aiResponse },
        ],
        updatedAt: new Date().toISOString(),
      };

      await updateChat(finalChat.id, finalChat.messages, finalChat.title);

      setCurrentChat(finalChat);
      setChats((prev) =>
        prev.map((c) => (c.id === finalChat.id ? finalChat : c))
      );
    } catch (error) {
      console.error('Error regenerating response:', error);
      setCurrentChat(currentChat); // Restore original
    } finally {
      setIsLoading(false);
    }
  }, [currentChat, isLoading, selectedModel, thinkingEnabled]);

  const handleEditMessage = useCallback(async (messageIndex: number, newContent: string) => {
    if (!currentChat) return;

    // Start editing
    if (newContent === '' && messageIndex >= 0) {
      setEditingMessageIndex(messageIndex);
      return;
    }

    // Cancel editing
    if (messageIndex === -1) {
      setEditingMessageIndex(null);
      return;
    }

    // Save edit
    const message = currentChat.messages[messageIndex];
    if (!message) return;

    const updatedMessages = [...currentChat.messages];
    updatedMessages[messageIndex] = { ...message, content: newContent };

    // If editing a user message, we need to regenerate responses after it
    if (message.role === 'user') {
      // Remove all messages after the edited one
      const messagesToKeep = updatedMessages.slice(0, messageIndex + 1);
      setCurrentChat({ ...currentChat, messages: messagesToKeep });
      setEditingMessageIndex(null);

      // Regenerate response
      setIsLoading(true);
      try {
        const aiResponse = await sendMessageToAPI(messagesToKeep);

        const finalChat: Chat = {
          ...currentChat,
          messages: [
            ...messagesToKeep,
            { role: 'assistant', content: aiResponse },
          ],
          updatedAt: new Date().toISOString(),
        };

        await updateChat(finalChat.id, finalChat.messages, finalChat.title);
        setCurrentChat(finalChat);
        setChats((prev) =>
          prev.map((c) => (c.id === finalChat.id ? finalChat : c))
        );
      } catch (error) {
        console.error('Error regenerating after edit:', error);
        setCurrentChat({ ...currentChat, messages: updatedMessages });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Just update the message content (for assistant messages)
      const updatedChat = { ...currentChat, messages: updatedMessages };
      setCurrentChat(updatedChat);
      await updateChat(updatedChat.id, updatedMessages, updatedChat.title);
      setEditingMessageIndex(null);
    }
  }, [currentChat, selectedModel, thinkingEnabled]);

  const handleDeleteMessage = useCallback(async (messageIndex: number) => {
    if (!currentChat) return;

    const updatedMessages = currentChat.messages.filter((_, i) => i !== messageIndex);

    // If no messages left, just clear
    if (updatedMessages.length === 0) {
      const updatedChat = { ...currentChat, messages: updatedMessages };
      setCurrentChat(updatedChat);
      await updateChat(updatedChat.id, updatedMessages, updatedChat.title);
      return;
    }

    // If deleting a user message, also remove all messages after it
    const messageToDelete = currentChat.messages[messageIndex];
    if (messageToDelete.role === 'user') {
      const messagesToKeep = updatedMessages.slice(0, messageIndex);
      const updatedChat = { ...currentChat, messages: messagesToKeep };
      setCurrentChat(updatedChat);
      await updateChat(updatedChat.id, messagesToKeep, updatedChat.title);
    } else {
      const updatedChat = { ...currentChat, messages: updatedMessages };
      setCurrentChat(updatedChat);
      await updateChat(updatedChat.id, updatedMessages, updatedChat.title);
    }

    setChats((prev) =>
      prev.map((c) => (c.id === currentChat.id ? { ...currentChat, messages: updatedMessages } : c))
    );
  }, [currentChat]);

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
          onEditMessage={handleEditMessage}
          onRegenerate={handleRegenerate}
          onDeleteMessage={handleDeleteMessage}
          editingMessageIndex={editingMessageIndex}
        />

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          thinkingEnabled={thinkingEnabled}
          onThinkingChange={setThinkingEnabled}
          showFileUpload={showFileUpload}
          onToggleFileUpload={() => setShowFileUpload(!showFileUpload)}
        />
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
