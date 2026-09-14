"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/types";
import {
  fetchConversation,
  sendMessage as dbSendMessage,
  subscribeToMessages,
} from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

/**
 * Realtime-aware chat hook.
 * Falls back to local-only messages when Supabase is not configured.
 */
export function useChat(bookingId: string, otherUserId: string) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<() => void>(() => {});

  // Load initial messages
  useEffect(() => {
    if (!profile?.id) return;
    let mounted = true;

    (async () => {
      if (isSupabaseConfigured()) {
        const rows = await fetchConversation(bookingId, profile.id, otherUserId);
        if (mounted) {
          setMessages(
            rows.map((r) => ({
              id: r.id,
              senderId: r.sender_id,
              receiverId: r.receiver_id,
              bookingId: r.booking_id ?? bookingId,
              content: r.content,
              timestamp: r.created_at,
              read: r.read,
            }))
          );
          setLoading(false);
        }
      } else {
        // Demo mode: seed a canned exchange so the UI feels alive.
        setMessages([
          {
            id: "d1",
            senderId: "demo-provider",
            receiverId: profile.id ?? "demo-user",
            bookingId,
            content: "Hey! Just confirming your booking. I'll be there on time.",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            read: true,
          },
          {
            id: "d2",
            senderId: profile.id ?? "demo-user",
            receiverId: "demo-provider",
            bookingId,
            content: "Perfect, see you then!",
            timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
            read: true,
          },
          {
            id: "d3",
            senderId: "demo-provider",
            receiverId: profile.id ?? "demo-user",
            bookingId,
            content: "On my way now, about 10 minutes out.",
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            read: true,
          },
        ]);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      unsubRef.current();
    };
  }, [profile?.id, bookingId, otherUserId]);

  // Subscribe to new rows in realtime
  useEffect(() => {
    if (!profile?.id) return;

    unsubRef.current = subscribeToMessages(
      (row) => {
        const msg: Message = {
          id: row.id,
          senderId: row.sender_id,
          receiverId: row.receiver_id,
          bookingId: row.booking_id ?? bookingId,
          content: row.content,
          timestamp: row.created_at,
          read: row.read,
        };
        setMessages((prev) => [...prev, msg]);
      },
      profile.id,
      otherUserId,
      bookingId
    );

    return () => unsubRef.current();
  }, [profile?.id, bookingId, otherUserId]);

  const send = useCallback(
    async (content: string) => {
      if (!profile?.id || !content.trim()) return;

      // Optimistic local update
      const optimistic: Message = {
        id: `local-${Date.now()}`,
        senderId: profile.id,
        receiverId: otherUserId,
        bookingId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages((prev) => [...prev, optimistic]);

      // Persist to DB (fires realtime event for the other side)
      await dbSendMessage({
        senderId: profile.id,
        receiverId: otherUserId,
        bookingId,
        content,
      });
    },
    [profile?.id, otherUserId, bookingId]
  );

  return { messages, send, loading };
}