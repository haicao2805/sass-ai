"use client";

import React from 'react'
import axios from 'axios';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

type Props = {
  className?: string;
  isProPlan?: boolean;
}

export const SubscriptionButton = ({ className, isProPlan }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/stripe");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong. Try again!!!"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        size="lg"
        disabled={loading}
        onClick={handleSubscribe}
        className="text-white w-full font-semibold hover:text-white border-none gradient-btn"
      >
        <span className="mr-2">{isProPlan ? "Manage Subscription" : "Upgrade to Pro"}</span>
        {
          !isProPlan &&
          <Sparkles />
        }
      </Button>
    </div>
  )
}
