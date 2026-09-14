"use client";

import { useState } from "react";
import { Sidebar, BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { ChatView } from "@/components/ui/chat-view";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";

export default function ProviderChatPage() {
  const { profile } = useAuth();

  // For a provider, conversations come from their completed bookings' clients.
  // In demo mode, show some sample client conversations.
  const sampleConversations = [
    {
      clientId: "c10",
      clientName: "David Chen",
      online: true,
      bookingTitle: "Kitchen Faucet Repair",
      lastMessage: "Perfect, see you then!",
      time: "2026-09-14T09:05:00Z",
    },
    {
      clientId: "c11",
      clientName: "Maria Lopez",
      online: false,
      bookingTitle: "Bathroom Leak Fix",
      lastMessage: "Thanks for the quick response!",
      time: "2026-09-13T17:45:00Z",
    },
    {
      clientId: "c12",
      clientName: "James Wilson",
      online: true,
      bookingTitle: "Water Heater Install",
      lastMessage: "Can you do a walkthrough tomorrow?",
      time: "2026-09-12T14:30:00Z",
    },
  ];

  const [activeClient, setActiveClient] = useState(sampleConversations[0]);

  const { messages, send } = useChat(
    "b1",
    activeClient.clientId
  );

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="sm:flex">
        <Sidebar role="provider" />
        <div className="flex-1 pb-24 sm:pb-0">
          <Header title="Messages" />

          <main className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <div className="hidden sm:block mb-3">
                  <h2 className="text-lg font-bold text-primary-900">Chats</h2>
                </div>
                {sampleConversations.map((conv) => {
                  const isActive = conv.clientId === activeClient.clientId;
                  return (
                    <button
                      key={conv.clientId}
                      onClick={() => setActiveClient(conv)}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border-2 transition-all duration-200",
                        isActive
                          ? "border-accent-500 bg-accent-50"
                          : "border-transparent bg-white shadow-card hover:border-surface-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-900 text-white flex items-center justify-center text-sm font-bold shrink-0 relative">
                          {conv.clientName.split(" ").map((n) => n[0]).join("")}
                          {conv.online && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-surface-900 text-sm truncate">
                              {conv.clientName}
                            </h3>
                            <span className="text-[10px] text-surface-400">
                              {timeAgo(conv.time)}
                            </span>
                          </div>
                          <p className="text-xs text-surface-500 truncate mt-0.5">
                            {conv.lastMessage}
                          </p>
                          <p className="text-[10px] text-accent-600 mt-0.5">{conv.bookingTitle}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="sm:col-span-3">
                <ChatView
                  recipient={{
                    name: activeClient.clientName,
                    online: activeClient.online,
                  }}
                  messages={messages}
                  currentUserId={profile?.id ?? "demo-user"}
                  onSendMessage={send}
                  height="h-[32rem] sm:h-[36rem]"
                />
              </div>
            </div>
          </main>

          <BottomNav role="provider" />
        </div>
      </div>
    </div>
  );
}