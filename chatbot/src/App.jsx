import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function App() {
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      message: "Hello i am chatbot",
      sender: "ChatBot",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    console.log("message: ", newMessage);
    const newMessages = [...messages, newMessage];
    // setMessages(newMessages);
    console.log("messages: ", messages);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTyping(true);
    await processMessage(newMessage);
    setTyping(false);
  };

  async function processMessage(newMesages) {
    const jsonMessage = JSON.stringify([
      {
        role: newMesages.sender === "ChatBot" ? "assistant" : "user",
        content: newMesages.message,
      },
    ]);

    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonMessage,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();

    const newMessage = {
      message: data[0].response,
      sender: "ChatBot",
      direction: "incoming",
    };
    console.log("newMesages1: ", newMessage);

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log("newMesages2: ", messages);
    setTyping(false);
  }

  return (
    <>
      <div className="App">
        <div style={{ position: "relative", height: "800px", width: "700px" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  typing ? <TypingIndicator content="Typing..." /> : null
                }
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput
                placeholder="Type your message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default App;
