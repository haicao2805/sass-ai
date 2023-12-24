import { cn } from '@/lib/utils'
import { BrainCircuit } from 'lucide-react'
import React from 'react'

type Props = {
  className?: string
}

const Logo = ({ className }: Props) => {
  return (
    <div className={cn(
      "flex items-center",
      className
    )}>
      <BrainCircuit color="#0ea5e9" size={40} />
      <span className={cn(
        "ml-2 font-bold text-3xl"
      )}>Brainfast</span>
    </div>
  )
}

export default Logo