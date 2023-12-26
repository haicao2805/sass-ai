import Footer from '@/components/landing/footer'
import Topbar from '@/components/landing/topbar'
import React, { ReactNode } from 'react'

const LandingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Topbar />
      <main className="max-w-5xl mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default LandingLayout