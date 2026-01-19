'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chat, Message, ImageAttachment, FileAttachment } from '@/types/chat';
import { truncateTitle } from '@/lib/utils';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { ChatInput, ChatInputRef, ChatModel } from '@/components/ChatInput';
import { Icons } from '@/components/Icons';
import { AuthGuard } from '@/components/AuthGuard';
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal';
import { ChatSearchBar } from '@/components/ChatSearchBar';
import { ExportModal } from '@/components/ExportModal';
import { fetchChats, createChat, updateChat, deleteChat, fetchChat } from '@/lib/db/chats';
import { getMemoriesForContext, extractMemoriesFromMessage, createMemory } from '@/lib/db/memories';
import { toggleMessageStar, getStarredIndicesForChat } from '@/lib/db/starred';
import { storage } from '@/lib/storage';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

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
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Search states
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingMessageIndices, setMatchingMessageIndices] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Export states
  const [showExportModal, setShowExportModal] = useState(false);

  // Starred states
  const [starredIndices, setStarredIndices] = useState<number[]>([]);

  // Ref for ChatInput send function
  const chatInputRef = useRef<ChatInputRef>(null);

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
      loadStarredIndices(chatId);
    } else {
      try {
        const loadedChat = await fetchChat(chatId);
        if (loadedChat) {
          setCurrentChat(loadedChat);
          loadStarredIndices(chatId);
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      }
    }
  };

  const loadStarredIndices = async (chatId: string) => {
    const indices = await getStarredIndicesForChat(chatId);
    setStarredIndices(indices);
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

  const handleToggleStar = async (messageIndex: number) => {
    if (!currentChat) return;

    const success = await toggleMessageStar(currentChat.id, messageIndex);
    if (success) {
      await loadStarredIndices(currentChat.id);
    }
  };

  // Keyboard shortcuts (defined after all handlers)
  useKeyboardShortcuts({
    newChat: {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
      description: 'Neuer Chat',
      action: handleNewChat,
    },
    toggleSidebar: {
      key: 'b',
      ctrlKey: true,
      metaKey: true,
      description: 'Sidebar umschalten',
      action: () => setSidebarOpen(prev => !prev),
    },
    sendMessage: {
      key: 'enter',
      metaKey: true,
      description: 'Nachricht senden',
      action: () => chatInputRef.current?.send(),
      preventDefault: true,
    },
    copyLastResponse: {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      description: 'Letzte Antwort kopieren',
      action: () => {
        if (currentChat && currentChat.messages.length > 0) {
          const lastAssistantMsg = [...currentChat.messages].reverse().find(m => m.role === 'assistant');
          if (lastAssistantMsg) {
            navigator.clipboard.writeText(lastAssistantMsg.content);
          }
        }
      },
    },
    editLastMessage: {
      key: 'e',
      ctrlKey: true,
      metaKey: true,
      description: 'Letzte Nachricht bearbeiten',
      action: () => {
        if (currentChat && currentChat.messages.length > 0) {
          const lastUserMsgIndex = [...currentChat.messages].reverse().findIndex(m => m.role === 'user');
          if (lastUserMsgIndex !== -1) {
            const actualIndex = currentChat.messages.length - 1 - lastUserMsgIndex;
            handleEditMessage(actualIndex, '');
          }
        }
      },
    },
    focusSearch: {
      key: '/',
      ctrlKey: true,
      metaKey: true,
      description: 'Suche fokussieren',
      action: () => setSidebarOpen(true),
    },
    showShortcuts: {
      key: '?',
      description: 'Tastaturkürzel anzeigen',
      action: () => setShowKeyboardShortcuts(true),
    },
  });

  // Search handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (!currentChat) return;

    if (!query.trim()) {
      setMatchingMessageIndices([]);
      setCurrentMatchIndex(0);
      return;
    }

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = currentChat.messages
      .map((msg, idx) => ({ idx, matches: regex.test(msg.content) }))
      .filter(({ matches }) => matches)
      .map(({ idx }) => idx);

    setMatchingMessageIndices(matches);
    setCurrentMatchIndex(0);

    // Scroll to first match
    if (matches.length > 0) {
      document.getElementById(`message-${matches[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentChat]);

  const handleSearchNavigate = useCallback((direction: 'up' | 'down') => {
    if (matchingMessageIndices.length === 0) return;

    let newIndex = currentMatchIndex + (direction === 'down' ? 1 : -1);
    if (newIndex < 0) newIndex = matchingMessageIndices.length - 1;
    if (newIndex >= matchingMessageIndices.length) newIndex = 0;

    setCurrentMatchIndex(newIndex);
    const messageIndex = matchingMessageIndices[newIndex];
    document.getElementById(`message-${messageIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [matchingMessageIndices, currentMatchIndex]);

  const handleToggleSearch = useCallback(() => {
    setSearchVisible(prev => !prev);
  }, []);

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
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
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
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSearch}
              className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-200"
              title="Suche im Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-200"
              title="Chat exportieren"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-all duration-200"
              title="Tastaturkürzel anzeigen (?)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.01" />
                <path d="M10 8h.01" />
                <path d="M14 8h.01" />
                <path d="M18 8h.01" />
                <path d="M6 12h.01" />
                <path d="M10 12h.01" />
                <path d="M14 12h.01" />
                <path d="M18 12h.01" />
                <path d="M8 16h.01" />
                <path d="M16 16h.01" />
              </svg>
            </button>
          </div>
        </header>

        <ChatSearchBar
          isVisible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onSearch={handleSearchChange}
          onNavigate={handleSearchNavigate}
          currentResult={currentMatchIndex}
          totalResults={matchingMessageIndices.length}
        />

        <MessageList
          messages={currentChat?.messages || []}
          isLoading={isLoading}
          onSuggestionClick={handleSuggestionClick}
          onEditMessage={handleEditMessage}
          onRegenerate={handleRegenerate}
          onDeleteMessage={handleDeleteMessage}
          onToggleStar={handleToggleStar}
          editingMessageIndex={editingMessageIndex}
          searchQuery={searchQuery}
          highlightedMessageIndex={matchingMessageIndices[currentMatchIndex]}
          starredIndices={starredIndices}
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
          ref={chatInputRef}
        />
      </main>

      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        chatTitle={currentChat?.title || 'Chat'}
        messages={currentChat?.messages || []}
        chatCreatedAt={currentChat?.createdAt}
        chatUpdatedAt={currentChat?.updatedAt}
      />
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
