import React from "react";
import { ChatProvider } from "./Chat/ChatContext";
import { ChatLayout } from "./Chat/ChatLayout";

function App() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}

export default App;
