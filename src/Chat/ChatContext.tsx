import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Conversation } from "./useChatStore";

interface ChatContextType {
  getConversations: () => Conversation[];
  activeConversation: string | undefined;
  setConversations: (data: Conversation[]) => void;
  setActiveConversation: (id: string) => void;
  activeMessage: string | undefined;
  setActiveMessage: (id: string) => void;
}

export interface ChatProviderProps {
  children?: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatData = (): ChatContextType => {
  const value = useContext(ChatContext);

  if (!value) {
    throw new Error(
      "A <ChatProvider/> cannot appear in the same component where the useChatData hook is invoked. Move the Provider to a component that is higher up in the tree."
    );
  }
  return value;
};

export const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string>();
  const [activeMessage, setActiveMessage] = useState<string>();

  const chatProviderValue = useMemo(
    () => ({
      getConversations: () => {
        return conversations.sort(
          (a, b) =>
            new Date(b.last_updated).getTime() -
            new Date(a.last_updated).getTime()
        );
      },
      setConversations,
      activeConversation,
      setActiveConversation,
      activeMessage,
      setActiveMessage,
    }),
    [activeConversation, activeMessage, conversations]
  );

  return (
    <ChatContext.Provider value={chatProviderValue}>
      {children}
    </ChatContext.Provider>
  );
};
