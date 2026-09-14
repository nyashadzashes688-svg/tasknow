"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types";
import { Send, Paperclip, Image as ImageIcon } from "lucide-react";

interface ChatWindowProps {
  recipient: { name: string; avatar?: string; online?: boolean };
  messages: Message[];
  currentUserId: string;
  onSendMessage?: (content: string) => void;
  height?: string;
}

export function ChatView({
  recipient,
  messages,
  currentUserId,
  onSendMessage,
  height = "h-[calc(100vh-12rem)]",
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage?.(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white border border-surface-100">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-100 bg-surface-50">
        <Avatar name={recipient.name} src={recipient.avatar} online={recipient.online} />
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-surface-900 truncate">{recipient.name}</h2>
          <p className="text-xs text-accent-600">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className={cn("flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface-50/50", height)}>
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={cn("flex", isMine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm animate-slide-up",
                  isMine
                    ? "bg-accent-500 text-white rounded-br-md"
                    : "bg-white border border-surface-100 text-surface-800 rounded-bl-md shadow-card"
                )}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <p
                  className={cn(
                    "text-[10px] mt-1",
                    isMine ? "text-white/60" : "text-surface-400"
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick replies */}
      <div className="px-4 py-2 border-t border-surface-100 flex gap-2 overflow-x-auto scrollbar-hide">
        {["On my way", "Ready", "How long?", "Thanks!"].map((quick) => (
          <button
            key={quick}
            type="button"
            onClick={() => onSendMessage?.(quick)}
            className="shrink-0 px-3 py-1.5 rounded-full border border-surface-200 text-xs font-medium text-surface-600 hover:border-accent-500 hover:text-accent-600 hover:bg-accent-50 transition-all"
          >
            {quick}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t border-surface-100 bg-white">
        <button className="p-2 rounded-xl hover:bg-surface-100 transition-colors shrink-0">
          <Paperclip className="w-5 h-5 text-surface-400" />
        </button>
        <button className="p-2 rounded-xl hover:bg-surface-100 transition-colors shrink-0">
          <ImageIcon className="w-5 h-5 text-surface-400" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-surface-50 border border-transparent focus:border-accent-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}