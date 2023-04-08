import { useChatData } from "./ChatContext";
import { Message } from "./useChatStore";
import { FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

export const useMessage = () => {
  const {
    setConversations,
    getConversations,
    activeConversation,
    setActiveMessage,
    activeMessage,
  } = useChatData();

  const conversations = getConversations();

  const buildMessage = (text: string, id: string): Message => {
    return {
      text: text,
      id: id,
      last_updated: new Date().toISOString(),
    };
  };
  const getFormData = (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    const id = uuidv4().toString();

    return {
      reply: data.get("reply") as string,
      id,
    };
  };
  const addMessage = (e: FormEvent<HTMLFormElement>) => {
    const data = getFormData(e);
    const message = buildMessage(data.reply, data.id);
    const updatedConversations = [...conversations];

    for (const item in updatedConversations) {
      if (updatedConversations[item].id === activeConversation) {
        updatedConversations[item].messages = [
          ...updatedConversations[item].messages,
          message,
        ];
      }
    }
    setConversations(updatedConversations);
    e.currentTarget.reset();
  };
  const editMessage = (e: FormEvent<HTMLFormElement>) => {
    const data = getFormData(e);
    const updatedConversations = [...conversations];

    for (const item in updatedConversations) {
      if (updatedConversations[item].id === activeConversation) {
        for (const message in updatedConversations[item].messages) {
          if (
            updatedConversations[item].messages[message].id === activeMessage
          ) {
            updatedConversations[item].messages[message].text = data.reply;
          }
        }
      }
    }

    setActiveMessage("");
    setConversations(updatedConversations);
    e.currentTarget.reset();
  };
  return {
    addMessage,
    editMessage,
  };
};
