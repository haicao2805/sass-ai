"use client";

import ToolsNavigation from '@/components/dashboard/tools-navigation';
import React from 'react';
import { useChat } from 'ai/react';
import { UserMessage } from '@/components/conversation/user-message';
import { AiResponse } from '@/components/conversation/ai-response';
import MarkdownResponse from '@/components/conversation/markdown-response';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { error } from 'console';
import { useProStore } from '@/store/pro-store';

const ConversationPage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { handleOpenOrCloseProModal } = useProStore();
  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading, stop, error } = useChat({ api: "/api/conversation" });

  React.useEffect(() => {
    if (error) {
      const errorParsed = JSON.parse(error?.message);
      if (errorParsed?.status === 403) {
        handleOpenOrCloseProModal();
      }
    }
  }, [error, handleOpenOrCloseProModal])

  const handleClearChat = () => {
    setMessages([]);
  }

  return (
    <div className='h-full flex flex-col justify-between relative'>
      <div ref={containerRef} className='overflow-y-auto space-y-10 scroll-smooth h-[calc(100vh-180px)]'>
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
            <ToolsNavigation title='Conversation' />
        }
      </div>
      <div className='mb-3'>
        <form
          action=""
          onSubmit={isLoading ? stop : handleSubmit}
          className='flex items-center w-full relative'
        >
          <Textarea
            placeholder='Do you have any questions today?'
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

export default ConversationPage