import React, { FC } from "react";
import { Message } from "../useChatStore";
import "./ConversationMessage.css";
import { format } from "date-fns";
import { DATE_FORMAT } from "../constants";

interface ConversationMessage extends Message {
  onMessageClick: (id: string) => void;
}

export const ConversationMessage: FC<ConversationMessage> = ({
  last_updated,
  text,
  id,
  onMessageClick,
}) => {
  const date = format(new Date(last_updated), DATE_FORMAT);

  return (
    <div className="message" onClick={() => onMessageClick(id)}>
      <small>{date}</small>
      <p>{text}</p>
    </div>
  );
};
