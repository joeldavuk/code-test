import { ConversationList } from "./ConversationList/ConversationList";
import { ConversationThread } from "./ConversationThread/ConversationThread";
import { FC, FormEvent, useEffect } from "react";
import { useChatData } from "./ChatContext";
import { useChatStore } from "./useChatStore";
import { ReplyForm } from "./ReplyForm/ReplyForm";
import { useMessage } from "./useMessage";
import "./ChatLayout.css";
import logo from "../logo.svg";

export const ChatLayout: FC = () => {
  const {
    setConversations,
    getConversations,
    activeConversation,
    activeMessage,
    setActiveConversation,
    setActiveMessage,
  } = useChatData();
  const { data } = useChatStore();
  const { addMessage, editMessage } = useMessage();
  const conversations = getConversations();

  const activeThread =
    conversations &&
    conversations.find((item) => item.id === activeConversation);
  const activeMessageText =
    activeThread?.messages.find((item) => item.id === activeMessage)?.text ||
    "";

  //sort messages by oldest first
  const messages = activeThread?.messages.sort(
    (a, b) =>
      new Date(a.last_updated).getTime() - new Date(b.last_updated).getTime()
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const action = data.get("action");
    switch (action) {
      case "add":
        addMessage(e);
        break;
      case "edit":
        editMessage(e);
        break;
    }
  };

  useEffect(() => {
    setConversations(data);
  }, []);

  return (
    <section className="chat-grid">
      <header>
        <img src={logo} alt="logo" />
      </header>
      <div className="conversations">
        {conversations && (
          <ConversationList
            list={conversations}
            activeThread={activeThread}
            onClick={setActiveConversation}
          />
        )}
      </div>
      <div>
        {activeThread && conversations && (
          <>
            <ConversationThread
              messages={messages}
              onMessageClick={setActiveMessage}
            />
            <ReplyForm
              onSubmit={(e) => handleSubmit(e)}
              defaultValue={activeMessageText}
            />
          </>
        )}
      </div>
    </section>
  );
};
