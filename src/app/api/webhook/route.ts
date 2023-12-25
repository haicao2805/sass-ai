import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import { buffer } from "node:stream/consumers";
import { NextApiRequest } from "next";

export async function POST(req: NextApiRequest) {
  try {
    const body = await buffer(req);
    const signature = req.headers["stripe-signature"] as string;
    console.log({
      body,
      signature,
      secret: process.env.STRIPE_WEBHOOK_SECRET!,
    });
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error: any) {
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      if (!session.metadata?.userId) {
        return new NextResponse("UserId is required.", { status: 404 });
      }

      const userSubscription = await prismadb.userSubscription.create({
        data: {
          userId: session.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
      console.log(userSubscription);
    }

    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      const userSubscription = await prismadb.userSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
      console.log(userSubscription);
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error },
      { status: 500 },
    );
  }
}
