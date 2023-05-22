"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, useContext } from "react";
import { MessagesContext } from "@/app/hooks/useChatbot";
import MarkdownLite from "./MarkdownLite";

interface ChatMessagesProps extends HTMLAttributes<HTMLDivElement> {}

const ChatMessages: React.FC<ChatMessagesProps> = ({className, ...props}) => {
  const { messages } = useContext(MessagesContext);
  const inverseMessages = [...messages].reverse();

  console.log(messages)

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch",
        className
      )}
    >
      <div className="flex flex-1 flex-grow" />
      {inverseMessages.map((message) => (
        <div className="chat-message" key={`${message.id}-${message.id}`}>
          <div
            className={cn("flex items-end", {
              "justify-end": message.isUserMessage,
            })}
          >
            <div
              className={cn(
                "flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden",
                {
                  "order-1 items-end": message.isUserMessage,
                  "order-2 items-start": !message.isUserMessage,
                }
              )}
            >
              <p
                className={cn("px-4 py-2 rounded-lg", {
                  "bg-red-500 text-white": message.isUserMessage,
                  "bg-gray-200 text-gray-900": !message.isUserMessage,
                })}
              >
                <MarkdownLite text={message.text} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
