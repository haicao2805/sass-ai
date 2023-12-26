"use client";

import { AiResponse } from '@/components/conversation/ai-response';
import MarkdownResponse from '@/components/conversation/markdown-response';
import { UserMessage } from '@/components/conversation/user-message';
import ToolsNavigation from '@/components/dashboard/tools-navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useProStore } from '@/store/pro-store';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import React from 'react'

const CodePage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { handleOpenOrCloseProModal } = useProStore();
  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading, stop, error } = useChat({ api: "/api/code" });

  React.useEffect(() => {
    if (error) {
      const errorParsed = JSON.parse(error?.message);
      if (errorParsed?.status === 403) {
        handleOpenOrCloseProModal();
      }
    }
  }, [error, handleOpenOrCloseProModal])

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClearChat = () => {
    setMessages([]);
  }

  return (
    <div className="h-full relative flex flex-col justify-between">
      <div
        ref={containerRef}
        className={cn(
          "h-[calc(100vh-180px)] pl-4 overflow-y-auto space-y-10 scroll-smooth",
          "lg:pl-0"
        )}>
        {
          messages.length > 0 ?
            <>
              {
                messages.map(m =>
                  <div key={m.id} className='whitespace-pre-wrap'>
                    {
                      m.role === "user" ?
                        <UserMessage>
                          <MarkdownResponse content={m.content} />
                        </UserMessage>
                        :
                        <AiResponse>
                          <MarkdownResponse content={m.content} />
                        </AiResponse>
                    }
                  </div>)
              }
              <div className='absolute left-0 bottom-20 text-right w-full pr-3'>
                <Button size="sm" variant="outline" onClick={handleClearChat}>Clear chat</Button>
              </div>
            </>
            :
            <ToolsNavigation title='Code' />
        }
      </div>
      <div className='mb-3'>
        <form
          action=""
          onSubmit={isLoading ? stop : handleSubmit}
          className='flex items-center w-full relative'
        >
          <Textarea
            placeholder='Generate code now'
            value={input}
            onChange={handleInputChange}
            className='min-h-1 resize-none'
          >
          </Textarea>
          <Button type='submit' disabled={!input} className='absolute right-2 gradient-btn'>
            {isLoading ? "Stop" : <Send />}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CodePage