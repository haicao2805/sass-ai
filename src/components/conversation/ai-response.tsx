import React, { ReactNode } from 'react'
import { BrainCircuit } from 'lucide-react'

type Props = {
  children: ReactNode
}

export const AiResponse = ({ children }: Props) => {
  return (
    <div className='p-4 pb-10 ml-20 relative mr-7 rounded-xl bg-secondary'>
      {children}
      <div className='bg-sky-500 w-14 h-14 flex justify-center items-center rounded-lg absolute -bottom-6 right-6'>
        <BrainCircuit size={40} color='white' />
      </div>
    </div>
  )
}
