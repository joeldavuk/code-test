import data from "./chatData.json";

export interface Message extends Pick<Conversation, "last_updated"> {
  id: string;
  text: string;
}

export interface Conversation {
  id: string;
  name: string;
  last_updated: string;
  messages: Message[];
}

export const useChatStore = () => {
  return {
    data,
  };
};
