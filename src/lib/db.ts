import type { Booking, Provider, UserRole } from "@/types";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { MOCK_PROVIDERS, MOCK_BOOKINGS } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Row shapes                                                          */
/* ------------------------------------------------------------------ */

export interface ProviderRow {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  bio: string | null;
  hourly_rate: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_available: boolean;
  completed_jobs: number;
  documents_uploaded: boolean;
  lat: number | null;
  lng: number | null;
  address: string | null;
  categories: string[];
}

export interface BookingRow {
  id: string;
  client_id: string;
  provider_id: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  lat: number | null;
  lng: number | null;
  estimated_cost: number;
  actual_cost: number | null;
  rating: number | null;
  review: string | null;
  created_at: string;
}

export interface MessageRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  booking_id: string | null;
  content: string;
  created_at: string;
  read: boolean;
}

/* ------------------------------------------------------------------ */
/* Mappers                                                             */
/* ------------------------------------------------------------------ */

export function mapProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: "provider",
    phone: row.phone ?? undefined,
    categories: (row.categories ?? []) as Provider["categories"],
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    hourlyRate: row.hourly_rate ?? 50,
    bio: row.bio ?? "",
    isVerified: row.is_verified ?? false,
    isAvailable: row.is_available ?? true,
    documentsUploaded: row.documents_uploaded ?? false,
    completedJobs: row.completed_jobs ?? 0,
    location:
      row.lat != null && row.lng != null
        ? { lat: row.lat, lng: row.lng, address: row.address ?? "" }
        : undefined,
    createdAt: new Date().toISOString(),
  };
}

export function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    clientId: row.client_id,
    providerId: row.provider_id,
    category: row.category as Booking["category"],
    title: row.title,
    description: row.description ?? "",
    status: row.status as Booking["status"],
    scheduledDate: row.scheduled_date,
    scheduledTime: row.scheduled_time,
    address: row.address,
    location: {
      lat: row.lat ?? 40.7128,
      lng: row.lng ?? -74.006,
    },
    estimatedCost: row.estimated_cost,
    actualCost: row.actual_cost ?? undefined,
    rating: row.rating ?? undefined,
    review: row.review ?? undefined,
    createdAt: row.created_at,
  };
}

/* ------------------------------------------------------------------ */
/* Providers                                                           */
/* ------------------------------------------------------------------ */

export async function fetchProviders(
  category?: string
): Promise<Provider[]> {
  if (!isSupabaseConfigured()) {
    return category
      ? MOCK_PROVIDERS.filter((p) => p.categories.includes(category as never))
      : MOCK_PROVIDERS;
  }
  try {
    const supabase = getSupabaseBrowserClient();
    let query = supabase.from("providers").select("*");
    if (category) {
      query = query.contains("categories", [category]);
    }
    const { data, error } = await query;
    if (error) return MOCK_PROVIDERS;
    return ((data ?? []) as ProviderRow[]).map(mapProvider);
  } catch {
    return MOCK_PROVIDERS;
  }
}

export async function fetchProviderById(id: string): Promise<Provider | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROVIDERS.find((p) => p.id === id) ?? null;
  }
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return mapProvider(data as ProviderRow);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Bookings                                                            */
/* ------------------------------------------------------------------ */

export async function fetchBookingsForUser(
  userId: string,
  role: UserRole
): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return role === "client"
      ? MOCK_BOOKINGS.filter((b) => b.clientId === "c1")
      : MOCK_BOOKINGS.filter((b) => b.providerId === "p1");
  }
  try {
    const supabase = getSupabaseBrowserClient();
    const column = role === "client" ? "client_id" : "provider_id";
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq(column, userId)
      .order("created_at", { ascending: false });
    if (error) return [];
    return ((data ?? []) as BookingRow[]).map(mapBooking);
  } catch {
    return [];
  }
}

export interface CreateBookingInput {
  clientId: string;
  providerId: string;
  category: string;
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  estimatedCost: number;
}

export async function createBooking(
  input: CreateBookingInput
): Promise<Booking | null> {
  if (!isSupabaseConfigured()) {
    return {
      id: `local-${Date.now()}`,
      clientId: input.clientId,
      providerId: input.providerId,
      category: input.category as Booking["category"],
      title: input.title,
      description: input.description ?? "",
      status: "pending",
      scheduledDate: input.scheduledDate,
      scheduledTime: input.scheduledTime,
      address: input.address,
      location: { lat: 40.7128, lng: -74.006 },
      estimatedCost: input.estimatedCost,
      createdAt: new Date().toISOString(),
    };
  }
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        client_id: input.clientId,
        provider_id: input.providerId,
        category: input.category,
        title: input.title,
        description: input.description ?? "",
        status: "pending",
        scheduled_date: input.scheduledDate,
        scheduled_time: input.scheduledTime,
        address: input.address,
        estimated_cost: input.estimatedCost,
      })
      .select()
      .single();
    if (error) return null;
    return mapBooking(data as BookingRow);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Messages & realtime                                                 */
/* ------------------------------------------------------------------ */

export async function fetchConversation(
  bookingId: string | null,
  userId: string,
  otherUserId: string
): Promise<MessageRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = getSupabaseBrowserClient();
    let query = supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${userId},and(sender_id.eq.${otherUserId})`)
      .order("created_at", { ascending: true });

    if (bookingId) {
      query = query.eq("booking_id", bookingId);
    }

    const { data, error } = await query;
    if (error) return [];
    // Keep only messages between these two users.
    return ((data ?? []) as MessageRow[]).filter(
      (m) =>
        (m.sender_id === userId && m.receiver_id === otherUserId) ||
        (m.sender_id === otherUserId && m.receiver_id === userId)
    );
  } catch {
    return [];
  }
}

export async function sendMessage(input: {
  senderId: string;
  receiverId: string;
  bookingId?: string;
  content: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return true; // demo: store in component state
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("messages").insert({
      sender_id: input.senderId,
      receiver_id: input.receiverId,
      booking_id: input.bookingId ?? null,
      content: input.content,
      read: false,
    });
    return !error;
  } catch {
    return false;
  }
}

/** Subscribe to new messages on the `messages` table filtered to a pair. */
export function subscribeToMessages(
  onEvent: (row: MessageRow) => void,
  userId: string,
  otherUserId: string,
  bookingId?: string
) {
  if (!isSupabaseConfigured()) return () => {};
  try {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`messages-${userId}-${otherUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: RealtimePostgresChangesPayload<MessageRow>) => {
          const row = payload.new as MessageRow;
          if (
            (row.sender_id === userId && row.receiver_id === otherUserId) ||
            (row.sender_id === otherUserId && row.receiver_id === userId)
          ) {
            if (bookingId && row.booking_id !== bookingId) return;
            onEvent(row);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}

/* ------------------------------------------------------------------ */
/* Subscription (Stripe-backed)                                        */
/* ------------------------------------------------------------------ */

export async function fetchSubscription(
  userId: string
): Promise<{ tier: string; status: string } | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("tier, status")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return data as { tier: string; status: string };
  } catch {
    return null;
  }
}