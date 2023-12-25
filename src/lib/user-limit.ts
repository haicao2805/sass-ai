import { auth } from "@clerk/nextjs";

import { prismadb } from "./prismadb";
import { DAY_IN_MS, MAX_FREE_COUNTS } from "@/constants";

export const getUserLimit = async () => {
  try {
    const { userId } = auth();

    if (!userId) return null;

    return await prismadb.userLimit.findUnique({
      where: {
        userId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserLimitCount = async () => {
  try {
    const userLimit = await getUserLimit();

    if (!userLimit) return 0;

    return userLimit.count;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const checkUserLimit = async () => {
  try {
    const userLimit = await getUserLimit();

    if (!userLimit || userLimit.count < MAX_FREE_COUNTS) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const incrementUserLimit = async () => {
  try {
    const { userId } = auth();

    if (!userId) return null;

    const userLimit = await getUserLimit();

    if (userLimit) {
      return await prismadb.userLimit.update({
        where: { userId },
        data: { count: userLimit.count + 1 },
      });
    }

    return await prismadb.userLimit.create({
      data: { userId, count: 1 },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const checkSubscription = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      return false;
    }

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId,
      },
      select: {
        stripeCustomerId: true,
        stripeCurrentPeriodEnd: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!userSubscription) return false;

    const isValid =
      userSubscription.stripePriceId &&
      userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
        Date.now();

    return !!isValid;
  } catch (error) {
    console.log(error);
    return false;
  }
};
