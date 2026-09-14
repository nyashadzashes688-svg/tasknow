"use client";

import { useEffect, useState } from "react";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { ChatView } from "@/components/ui/chat-view";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/lib/auth-context";
import { fetchProviders } from "@/lib/db";
import type { Provider } from "@/types";
import { cn } from "@/lib/utils";

export default function ClientChatPage() {
  const { profile } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [activeProviderId, setActiveProviderId] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders().then((list) => {
      setProviders(list);
      if (list.length > 0) {
        setActiveProviderId((prev) => prev ?? list[0].id);
      }
    });
  }, []);

  const activeProvider = providers.find((p) => p.id === activeProviderId) ?? providers[0];

  const { messages, send } = useChat("b1", activeProvider?.id ?? "p1");

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="client" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Messages" />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {/* Conversation list */}
              <div className="sm:col-span-2 space-y-2">
                <div className="hidden sm:block mb-3">
                  <h2 className="text-lg font-bold text-primary-900">Chats</h2>
                </div>
                {providers.map((conv) => {
                  const isActive = conv.id === activeProvider?.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveProviderId(conv.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border-2 transition-all duration-200",
                        isActive
                          ? "border-accent-500 bg-accent-50"
                          : "border-transparent bg-white shadow-card hover:border-surface-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-900 text-white flex items-center justify-center text-sm font-bold shrink-0 relative">
                          {conv.name.split(" ").map((n) => n[0]).join("")}
                          {conv.isAvailable && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-surface-900 text-sm truncate">
                              {conv.name}
                            </h3>
                          </div>
                          <p className="text-xs text-surface-500 truncate mt-0.5">
                            {conv.categories.slice(0, 2).join(", ") || "Provider"}
                          </p>
                          <p className="text-[10px] text-accent-600 mt-0.5">
                            ★ {conv.rating} · {conv.completedJobs} jobs
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Chat window */}
              <div className="sm:col-span-3">
                <ChatView
                  recipient={{
                    name: activeProvider?.name ?? "Provider",
                    online: activeProvider?.isAvailable,
                  }}
                  messages={messages}
                  currentUserId={profile?.id ?? "demo-user"}
                  onSendMessage={send}
                  height="h-[32rem] sm:h-[36rem]"
                />
              </div>
            </div>
          </main>

          <BottomNav role="client" />
        </div>
      </div>
    </div>
  );
}