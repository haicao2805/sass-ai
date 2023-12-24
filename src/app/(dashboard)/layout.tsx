import React, { ReactNode } from 'react'
import UpdateProModal from '@/components/dashboard/update-pro-modal'
import Sidebar from '@/components/sidebar'
import MobileSidebar from '@/components/sidebar/mobile-sidebar'
import MobileTopbar from '@/components/mobile-topbar'
import { cn } from '@/lib/utils'
import { checkSubscription, getUserLimitCount } from '@/lib/user-limit'

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const isProPlan = await checkSubscription();
  const userLimitCount = await getUserLimitCount();

  return (
    <div>
      <header>
        <MobileTopbar />
      </header>
      <main className="lg:bg-gray-950 lg:overflow-hidden lg:pl-80 [&:has([is-navbar-minimal])]:lg:pl-20 lg:pr-7 lg:py-7">
        <Sidebar userLimitCount={userLimitCount} isProPlan={isProPlan}
          className={cn(
            "fixed left-0 z-20 w-80 [&:has([is-navbar-minimal])]:w-fit hidden",
            "lg:block"
          )}
        />
        <MobileSidebar
          isProPlan={isProPlan}
          userLimitCount={userLimitCount}
        />
        <UpdateProModal
          isProPlan={isProPlan}
        />
        <div className={cn(
          "bg-background h-[calc(100vh-56px)]",
          "lg:rounded-3xl lg:p-7"
        )}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout