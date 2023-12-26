import {
  checkSubscription,
  checkUserLimit,
  incrementUserLimit,
} from "@/lib/user-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const configuration = {
  apiKey: process.env.OPENAI_API_KEY!,
};

const openai = new OpenAI(configuration);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { prompt, amount, resolution } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("Miss OpenAI API Key.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    const reachToLimit = await checkUserLimit();
    const isProPlan = await checkSubscription();

    if (!reachToLimit && !isProPlan) {
      return NextResponse.json(
        {
          message: "You are reach to limit. Please upgrade to higher plan.",
          status: 403,
        },
        { status: 403 },
      );
    }

    const response = await openai.images.generate({
      prompt,
      n: Number(amount),
      size: resolution,
    });

    if (!isProPlan) {
      await incrementUserLimit();
    }

    return NextResponse.json(response);
  } catch (error) {}
}
