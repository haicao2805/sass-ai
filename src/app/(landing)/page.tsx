import Features from '@/components/landing/features';
import Hero from '@/components/landing/hero';
import React from 'react'

const LandingPage = () => {
  return (
    <div className="h-full w-full">
      <Hero />
      <Features />
    </div>
  )
}

export default LandingPage;

