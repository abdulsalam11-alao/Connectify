import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

interface MessageProps {
  isOwnMessage: boolean;
}

const Container = styled.div`
  width: 400px;
  height: 600px;
  margin: 0 auto;
  padding: 16px;
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const UserStatus = styled.span`
  font-size: 12px;
  color: var(--color-grey);
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 8px;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8f8f8;
`;

const Message = styled.div<MessageProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.isOwnMessage ? "flex-end" : "flex-start"};
  margin: 8px 0;
`;

const MessageBubble = styled.div<MessageProps>`
  background-color: ${(props) => (props.isOwnMessage ? "#d1e7ff" : "#ffffff")};
  padding: 10px;
  border-radius: 16px;
  max-width: 60%;
  color: #333;
`;

const TimeStamp = styled.span<MessageProps>`
  font-size: 10px;
  color: var(--color-grey);
  margin-top: 4px;
  display: block;
  text-align: ${(props) => (props.isOwnMessage ? "right" : "left")};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #ddd;
`;

const InputField = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: #f1f1f1;
  font-size: 14px;

  &:focus {
    outline: none;
    background-color: #e8e8e8;
  }
`;

const SendButton = styled(IconButton)`
  color: var(--primary-color);
  margin-left: 8px;
`;

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: "I took great photos there. You have to join next time!",
      time: "23:53",
      isOwnMessage: false,
    },
    { text: "Absolutely. When?", time: "11:00", isOwnMessage: true },
    { text: "Yay!", time: "11:05", isOwnMessage: false },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { text: newMessage, time: "Now", isOwnMessage: true },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Container>
      <Header>
        <UserInfo>
          <ArrowBackIosNewIcon onClick={() => navigate(-1)} />
          <Avatar alt="Anna" src="https://via.placeholder.com/40" />
          <UserDetails>
            <UserName>Anna</UserName>
            <UserStatus>Online</UserStatus>
          </UserDetails>
        </UserInfo>
        <ActionIcons>
          <IconButton>
            <PhoneIcon />
          </IconButton>
          <IconButton>
            <VideoCallIcon />
          </IconButton>
        </ActionIcons>
      </Header>

      {/* Messages Section */}
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isOwnMessage={msg.isOwnMessage}>
            <MessageBubble isOwnMessage={msg.isOwnMessage}>
              {msg.text}
              <TimeStamp isOwnMessage={msg.isOwnMessage}>{msg.time}</TimeStamp>
            </MessageBubble>
          </Message>
        ))}
      </MessagesContainer>

      {/* Input Section */}
      <InputContainer>
        <InputField
          type="text"
          placeholder="Type here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <SendButton onClick={handleSendMessage}>
          <SendIcon />
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default ChatPage;
