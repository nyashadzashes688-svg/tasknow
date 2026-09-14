import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_missing");

const tierFromProduct: Record<string, string> = {
  basic: "basic",
  pro: "pro",
  enterprise: "enterprise",
};

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 501 }
    );
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 501 }
    );
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const handleSessionCompleted = async (session: Stripe.Checkout.Session) => {
    const userId = session.metadata?.supabaseUserId;
    const tier = session.metadata?.tier;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : undefined;

    if (!userId || !tier || !tierFromProduct[tier.toLowerCase()]) return;

    await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        tier: tier.toLowerCase(),
        status: "active",
        current_period_end: session.expires_at
          ? new Date(session.expires_at * 1000).toISOString()
          : null,
      },
      { onConflict: "user_id" }
    );
  };

  const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
    const userId = subscription.metadata?.supabaseUserId;

    if (!userId) return;

    await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        tier: "free",
        status: "cancelled",
      },
      { onConflict: "user_id" }
    );
  };

  switch (event.type) {
    case "checkout.session.completed":
      await handleSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}