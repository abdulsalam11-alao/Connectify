// ChatPage.tsx

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/db";
import { useUser } from "../hook/useUser";
import { User } from "../context/UserContext";

// TypeScript Interfaces
interface MessageProps {
  isOwnMessage: boolean;
}

interface Message {
  id: string;
  text: string;
  imageUrl?: string;
  time: string;
  isOwnMessage: boolean;
}

// Styled Components
const Container = styled.div`
  width: 400px;
  height: 100vh;
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
  background-color: var(--background-light);
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
  color: var(--text-dark);
  position: relative;
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

// Updated ChatPage Component
const ChatPage: React.FC = () => {
  const { chatid } = useParams<{ chatid: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { state: userState } = useUser();
  const { user: userCred } = userState;
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch user data based on chatid
  const getUser = async () => {
    if (chatid) {
      try {
        const userRef = doc(db, "users", chatid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          console.error("User document does not exist for chatid:", chatid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.error("User ID (chatid) is undefined");
    }
  };

  useEffect(() => {
    getUser();
  }, [chatid]);

  // Initialize chat if it doesn't exist
  useEffect(() => {
    if (!userCred?.uid || !chatid) {
      console.warn("userCred.uid or chatid is undefined:", {
        userCred,
        chatid,
      });
      return;
    }

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    const createOrGetChat = async () => {
      try {
        const chatDocRef = doc(db, "chat", uniqueChatId);
        const chatDoc = await getDoc(chatDocRef);

        console.log("Chat document:", chatDoc);

        if (chatDoc.exists()) {
          console.log("Chat already exists with ID:", chatDoc.id);
        } else {
          await setDoc(
            chatDocRef,
            { member: chatMembers, timestamp: serverTimestamp() },
            { merge: true }
          );
          console.log("New chat created with ID:", chatDocRef.id);
        }
      } catch (error) {
        console.error("Error checking or creating chat:", error);
      }
    };

    createOrGetChat();
  }, [chatid, userCred]);

  // Real-time listener for messages
  useEffect(() => {
    if (!chatid || !userCred?.uid) return;

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    const messagesCollectionRef = collection(
      db,
      "chatMessage",
      uniqueChatId,
      "messages"
    );
    const q = query(messagesCollectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.message,
            imageUrl: data.imageUrl || undefined,
            time: data.timestamp
              ? data.timestamp.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now",
            isOwnMessage: data.userId === userCred.uid,
          };
        });
        setMessages(messagesData);
        scrollToBottom();
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    return () => unsubscribe();
  }, [chatid, userCred]);

  // Handle image upload
  const handleImageUpload = async (file: File): Promise<string | null> => {
    const storage = getStorage();
    const timestamp = Date.now();
    const storageRef = ref(storage, `images/${file.name}-${timestamp}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && !selectedImage) return;

    if (!userCred || !chatid) {
      console.warn("User credentials or chatid missing.");
      return;
    }

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    const messagesCollectionRef = collection(
      db,
      "chatMessage",
      uniqueChatId,
      "messages"
    );

    let imageUrl = null;
    if (selectedImage) {
      imageUrl = await handleImageUpload(selectedImage);
      setSelectedImage(null);
    }

    const messageData = {
      from: {
        name: userCred.fullName,
        email: userCred.email,
      },
      userId: userCred.uid,
      message: newMessage.trim(),
      imageUrl,
      chatRef: uniqueChatId,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(messagesCollectionRef, messageData);

      // Update lastMessage and lastMessageTime in the chat document
      const chatDocRef = doc(db, "chat", uniqueChatId);
      await setDoc(
        chatDocRef,
        {
          lastMessage: newMessage.trim() || (imageUrl ? "Image sent" : ""),
          lastMessageTime: serverTimestamp(),
        },
        { merge: true }
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle deleting a message
  const handleDeleteMessage = async (messageId: string) => {
    if (!chatid || !messageId) {
      console.warn("Chat ID or Message ID is missing.");
      return;
    }

    // Optional: Confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    const chatMembers = [userCred?.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    const messageDocRef = doc(
      db,
      "chatMessage",
      uniqueChatId,
      "messages",
      messageId
    );

    try {
      await deleteDoc(messageDocRef);
      console.log(`Message with ID ${messageId} deleted successfully.`);
      // Optionally, provide user feedback here (e.g., a toast notification)
    } catch (error) {
      console.error("Error deleting message:", error);
      // Optionally, handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <Container>
      <Header>
        <UserInfo>
          <ArrowBackIosNewIcon onClick={() => navigate(-1)} />
          <Avatar
            alt={user?.fullName || "User"}
            src={user?.photoUrl || ""}
            onClick={() => navigate(`/newMessage/profile/${chatid}`)}
            style={{ cursor: "pointer" }}
          />
          <UserDetails>
            <UserName>{user?.fullName || "Unknown User"}</UserName>
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
        {messages.map((msg) => (
          <Message key={msg.id} isOwnMessage={msg.isOwnMessage}>
            <MessageBubble isOwnMessage={msg.isOwnMessage}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.isOwnMessage ? "flex-end" : "flex-start",
                }}
              >
                {msg.text && <span>{msg.text}</span>}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Sent Image"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                )}
                {msg.isOwnMessage && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteMessage(msg.id)}
                    style={{ alignSelf: "flex-end", marginTop: "5px" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <TimeStamp isOwnMessage={msg.isOwnMessage}>{msg.time}</TimeStamp>
            </MessageBubble>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Input Section */}
      <InputContainer>
        <label htmlFor="image-upload">
          <IconButton component="span">
            <ImageIcon />
          </IconButton>
        </label>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          onChange={(e) =>
            setSelectedImage(e.target.files ? e.target.files[0] : null)
          }
        />
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
