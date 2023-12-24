"use client";

import React from 'react'
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { useSidebarStore } from '@/store/sidebar-store';
import Sidebar from '.';


type Props = {
  className?: string;
  isProPlan?: boolean;
  userLimitCount: number
}


const MobileSidebar = ({ className, isProPlan, userLimitCount }: Props) => {
  const { isOpen } = useSidebarStore();

  return (
    <Sheet open={isOpen}>
      <SheetContent side="left" className="w-screen border-none bg-black p-0 pt-8">
        <Sidebar
          isProPlan={isProPlan}
          userLimitCount={userLimitCount} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar