import React, { FC, MouseEvent, useState } from "react";
import { Conversation } from "../useChatStore";
import "./ConversationList.css";
import cx from "classnames";

interface ConversationListProps {
  list: Conversation[];
  onClick: (id: string) => void;
}

export const ConversationList: FC<ConversationListProps> = ({
  list,
  onClick,
}) => {
  const [activeLinkId, setActiveLink] = useState<string | undefined>();

  const handleClick = (e: MouseEvent, item: Conversation) => {
    e.preventDefault();
    setActiveLink(item.id);
    onClick(item.id);
  };

  return (
    <ul className="conversation-list">
      {list.map((item) => (
        <li
          key={item.id}
          className={cx(item.id === activeLinkId ? "active" : "")}
        >
          <a
            href={`#${item.id}`}
            onClick={(e: MouseEvent) => handleClick(e, item)}
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
};
