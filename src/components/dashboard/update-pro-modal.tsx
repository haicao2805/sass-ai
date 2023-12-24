"use client";

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubscriptionButton } from '../subscription-button';
import { useProStore } from '@/store/pro-store';


type Props = {
  className?: string;
  isProPlan?: boolean;
}

const UpdateProModal = ({ className, isProPlan }: Props) => {
  const { handleCloseProModal, isOpen } = useProStore();

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={handleCloseProModal} showOverlay>
        <SubscriptionButton isProPlan={isProPlan} />
      </DialogContent>
    </Dialog>

  )
}

export default UpdateProModal