import React, { FC } from "react";
import { Message } from "../useChatStore";
import { ConversationMessage } from "../ConversationMessage/ConversationMessage";
import "./ConversationThread.css";

interface Thread {
  messages: Message[] | undefined;
  onMessageClick: (id: string) => void;
}

export const ConversationThread: FC<Thread> = ({
  messages,
  onMessageClick,
}) => {
  return (
    <div className="thread">
      {messages?.map((item: Message) => (
        <ConversationMessage
          key={item.id}
          {...item}
          onMessageClick={onMessageClick}
        />
      ))}
    </div>
  );
};
