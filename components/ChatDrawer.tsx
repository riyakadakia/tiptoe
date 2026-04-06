'use client';

import { useEffect, useRef, useState } from 'react';
import { type Article } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import ChatMessage, { type Message } from './ChatMessage';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  seedArticle: Article | null;
  articles: Article[];
  chatAvailable: boolean;
}

let messageCounter = 0;
function nextId() {
  return `msg-${++messageCounter}`;
}

function greeting(article: Article | null): Message {
  const content = article
    ? `Let's talk about "${article.headline}." What would you like to know?`
    : "Ask me anything about today's stories.";
  return { id: nextId(), role: 'assistant', content };
}

export default function ChatDrawer({ open, onClose, seedArticle, articles, chatAvailable }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>(() => [greeting(seedArticle)]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages([greeting(seedArticle)]);
    setInput('');
    setChatError(null);
  }, [seedArticle]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cancel in-flight request when drawer closes
  useEffect(() => {
    if (!open) abortRef.current?.abort();
  }, [open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { id: nextId(), role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setStreaming(true);
    setChatError(null);

    const assistantId = nextId();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          articles,
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error: string };
        throw new Error(err.error ?? 'Chat request failed.');
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setChatError((err as Error).message);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-card shadow-lg transition-transform duration-300 sm:w-[420px] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-base font-semibold">Chat</h2>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Unavailable state */}
        {!chatAvailable && (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              Chat is unavailable.
              <br />
              Add an <code className="rounded bg-muted px-1 py-0.5 text-xs">ANTHROPIC_API_KEY</code> to{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code> to enable it.
            </p>
          </div>
        )}

        {/* Messages */}
        {chatAvailable && (
          <ScrollArea className="flex-1 px-5 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {streaming && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                    …
                  </div>
                </div>
              )}
              {chatError && (
                <p className="text-center text-xs text-destructive">{chatError}</p>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        )}

        {/* Input */}
        <div className="border-t border-border px-5 py-4">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a story…"
              className="flex-1"
              disabled={streaming || !chatAvailable}
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming || !chatAvailable}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
