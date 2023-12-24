"use client";

import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { useSidebarStore } from '@/store/sidebar-store';
import { X } from 'lucide-react';

const SidebarToggle = () => {
  const { isMinimal, handleChangeSidebar, handleOpenOrClose } = useSidebarStore();

  return (
    <div>
      <div
        className="cursor-pointer hidden lg:block"
        is-navbar-minimal={isMinimal ? "true" : undefined}
        onClick={handleChangeSidebar}>
        <Image
          src={`/icons/menu-${isMinimal ? 'open' : 'close'}.svg`}
          width={24}
          height={24}
          alt="navbar icon" />
      </div>
      <Button
        variant="ghost"
        className="lg:hidden"
        onClick={handleOpenOrClose}
        size="icon">
        <X />
      </Button>
    </div>
  )
}

export default SidebarToggle