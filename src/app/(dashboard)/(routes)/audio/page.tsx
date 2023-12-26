"use client";

import React from 'react'
import { cn } from '@/lib/utils'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useProStore } from '@/store/pro-store';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import ToolsNavigation from '@/components/dashboard/tools-navigation';
import Image from 'next/image';
import { UserMessage } from '@/components/conversation/user-message';
import { AiResponse } from '@/components/conversation/ai-response';
import Loading from '@/components/loading';
import { Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';

type MessageType = {
  id: string;
  content: string;
  role: "user" | "assistant";
}

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Photo prompt is required"
  }),
})

const AudioPage = () => {
  const { handleOpenOrCloseProModal } = useProStore();
  const { toast } = useToast();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<MessageType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMessages(cur =>
        [...cur, {
          id: uuidv4(),
          role: "user",
          content: `${values.prompt}`
        }, {
          id: uuidv4(),
          role: "assistant",
          content: ""
        }
        ]
      );

      handleScrollToBottom();
      form.reset();

      const { data } = await axios.post('/api/audio', values);
      console.log("audio data: ", data);
      setMessages(current => {
        const newMessages = [...current];
        newMessages[newMessages.length - 1].content = data.audio;
        return newMessages;
      });
      handleScrollToBottom();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        handleOpenOrCloseProModal();
      } else {
        setMessages([]);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    }
  }

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }

  const handleClearChat = () => {
    setMessages([]);
  }

  return (
    <div className='h-full flex flex-col justify-between relative'>
      <div
        ref={containerRef}
        className={cn(
          "h-[calc(100vh-180px)] pl-4 overflow-y-auto space-y-10 scroll-smooth",
          "lg:pl-0"
        )}>
        {messages.length > 0
          ? <>
            {
              messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                  {m.role === 'user' ?
                    <UserMessage>{m.content}</UserMessage>
                    :
                    <AiResponse>
                      {
                        m.content ? <div className={cn(
                          "block mb-4 space-y-4",
                          "lg:flex lg:flex-wrap lg:items-center lg:space-x-4 lg:space-y-0"
                        )}>
                          <audio src={m.content} controls autoPlay />
                        </div>
                          :
                          <Loading />
                      }
                    </AiResponse>
                  }
                </div>
              ))
            }
            <div className="absolute left-0 bottom-0 text-right w-full pr-3">
              <Button
                size="sm"
                onClick={handleClearChat}
                variant="outline"
              >
                Clear chat
              </Button>
            </div>
          </>
          : <ToolsNavigation title='Audio' />}
      </div>
      <div className="mb-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center w-full relative"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="Description your audio"
                      className="min-h-1 resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="absolute right-2 flex items-center space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="gradient-btn">
                <Send />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AudioPage