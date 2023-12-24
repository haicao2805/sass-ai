"use client";

import React from 'react'
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useSidebarStore } from '@/store/sidebar-store';
import { cn } from '@/lib/utils';
import Logo from './logo';

const MobileTopbar = () => {
  const { handleOpenOrClose } = useSidebarStore();

  return (
    <div className={cn(
      "flex items-center p-4 justify-between sticky top-0 z-30",
      "lg:hidden"
    )}>
      <Logo />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenOrClose}
      >
        <Menu />
      </Button>
    </div>
  )
}

export default MobileTopbar