import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_missing");

type PlanTier = "free" | "basic" | "pro" | "enterprise";

const priceIds: Record<string, string | undefined> = {
  free: process.env.STRIPE_PRICE_FREE,
  basic: process.env.STRIPE_PRICE_BASIC,
  pro: process.env.STRIPE_PRICE_PRO,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

export async function POST(request: Request) {
  try {
    if (process.env.STRIPE_SECRET_KEY === "sk_test_missing" || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment." },
        { status: 501 }
      );
    }

    const body = (await request.json()) as { tier?: PlanTier };
    const tier = body.tier ?? "free";

    if (!["free", "basic", "pro", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid plan tier." }, { status: 400 });
    }

    // Free plan doesn't need Stripe — just record the switch.
    if (tier === "free") {
      const admin = getSupabaseAdminClient();
      const server = getSupabaseServerClient();
      if (admin && server) {
        const {
          data: { user },
        } = await server.auth.getUser();
        if (user) {
          await admin
            .from("subscriptions")
            .upsert(
              { user_id: user.id, tier, status: "active" },
              { onConflict: "user_id" }
            );
        }
      }
      return NextResponse.json({ url: "/pricing?success=1" });
    }

    const priceId = priceIds[tier];
    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price configured for the "${tier}" tier.` },
        { status: 400 }
      );
    }

    // Authenticated user required for paid upgrades.
    const server = getSupabaseServerClient();
    if (!server) {
      return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });
    }
    const {
      data: { user },
    } = await server.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.headers.get("origin") ?? "http://localhost:3000";

    // Reuse an existing Stripe customer if one exists.
    const admin = getSupabaseAdminClient();
    let stripeCustomerId: string | undefined;
    if (admin) {
      const { data: existing } = await admin
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();
      stripeCustomerId = existing?.stripe_customer_id ?? undefined;
    }

    let customer: Stripe.Customer;
    if (stripeCustomerId) {
      try {
        customer = (await stripe.customers.retrieve(stripeCustomerId)) as Stripe.Customer;
      } catch {
        customer = await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: { supabaseUserId: user.id },
        });
      }
    } else {
      customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabaseUserId: user.id },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        supabaseUserId: user.id,
        tier,
      },
      subscription_data: {
        metadata: {
          supabaseUserId: user.id,
          tier,
        },
      },
      success_url: `${origin}/pricing?success=1`,
      cancel_url: `${origin}/pricing?canceled=1`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}