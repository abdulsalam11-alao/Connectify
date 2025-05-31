import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
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
  audioUrl?: string;
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
  border-bottom: 1px solid var(--color-grey);
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
  color: var(--text-dark);
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
  align-items: flex-end;
  justify-content: ${(props) =>
    props.isOwnMessage ? "flex-end" : "flex-start"};
  margin: 8px 0;
`;

const MessageBubble = styled.div<MessageProps>`
  background-color: ${(props) =>
    props.isOwnMessage ? "var(--color-blue)" : "grey"};
  color: ${(props) =>
    props.isOwnMessage ? "var(--text-light)" : "var(--text-dark)"};
  padding: 10px;
  border-radius: 16px;
  max-width: 60%;
  min-width: 50%;
  position: relative;
`;

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  color: var(--color-red);
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
  }

  ${MessageBubble}:hover & {
    opacity: 1;
  }
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
  border-top: 1px solid var(--color-grey);
  align-items: center;
  background-color: var(--background-light);
`;

const InputField = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: var(--color-grey);
  color: var(--text-dark);
  font-size: 14px;

  &:focus {
    outline: none;
    background-color: var(--color-grey);
  }
`;

const SendButton = styled(IconButton)`
  color: var(--primary-color);
  margin-left: 8px;
`;

const AudioPlayer = styled.audio`
  margin-top: 10px;
  width: 100%;
`;

const RecordButton = styled(IconButton)<{ $isRecording: boolean }>`
  color: ${(props) =>
    props.$isRecording ? "var(--color-blue)" : "var(--color-grey)"};
  background-color: ${(props) =>
    props.$isRecording ? "var(--color-light-blue)" : "transparent"};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.$isRecording
        ? "var(--color-blue-hover)"
        : "var(--color-grey-light)"};
  }
`;

const ImagePreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  border-radius: 10px;
  margin-left: 8px;
`;

// Main Component
const ChatPage: React.FC = () => {
  const { chatid } = useParams<{ chatid: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const { state: userState } = useUser();
  const { user: userCred } = userState;
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");

  // Track if window/tab is focused
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  // Scroll to bottom of messages
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

        if (!chatDoc.exists()) {
          await setDoc(
            chatDocRef,
            { member: chatMembers, timestamp: serverTimestamp() },
            { merge: true }
          );
          console.log("New chat created with ID:", chatDocRef.id);
        } else {
          console.log("Chat already exists with ID:", chatDoc.id);
        }
      } catch (error) {
        console.error("Error checking or creating chat:", error);
      }
    };

    createOrGetChat();
  }, [chatid, userCred]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Real-time listener for messages with notification on new message
  const prevMessagesRef = useRef<Message[]>([]);

  useEffect(() => {
    if (!userCred?.uid || !chatid) return;

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    const messagesCollection = collection(db, "chat", uniqueChatId, "messages");
    const messagesQuery = query(
      messagesCollection,
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const newMessages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          id: doc.id,
          text: data.text,
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
          time: data.time,
          isOwnMessage: data.sender === userCred.uid,
        });
      });

      setMessages(newMessages);

      // Notification on new message if window/tab is NOT focused
      if (
        newMessages.length > prevMessagesRef.current.length &&
        !isWindowFocused
      ) {
        const newMsg = newMessages[newMessages.length - 1];

        if (!newMsg.isOwnMessage && Notification.permission === "granted") {
          new Notification(`New message from ${user?.fullName || "User"}`, {
            body: newMsg.text || "Sent an image/audio",
          });
        }
      }

      prevMessagesRef.current = newMessages;
    });

    return () => unsubscribe();
  }, [chatid, userCred, user, isWindowFocused]);

  // Window focus/blur handlers
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const sendMessage = async () => {
    if (!userCred?.uid || !chatid) return;

    if (!newMessage.trim() && !selectedImage && !audioBlob) return;

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");
    const messagesCollection = collection(db, "chat", uniqueChatId, "messages");

    let imageUrl: string | undefined;
    let audioUrl: string | undefined;

    try {
      // Upload image if selected
      if (selectedImage) {
        const storage = getStorage();
        const imageRef = ref(
          storage,
          `chat_images/${uniqueChatId}/${Date.now()}_${selectedImage.name}`
        );
        await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Upload audio if recorded
      if (audioBlob) {
        const storage = getStorage();
        const audioRef = ref(
          storage,
          `chat_audio/${uniqueChatId}/${Date.now()}.webm`
        );
        await uploadBytes(audioRef, audioBlob);
        audioUrl = await getDownloadURL(audioRef);
      }

      await addDoc(messagesCollection, {
        sender: userCred.uid,
        text: newMessage,
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null,
        time: new Date().toLocaleTimeString(),
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
      setSelectedImage(null);
      setImagePreviewUrl(null);
      setAudioBlob(null);
      setAudioURL("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle message input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  // Handle Enter key press in input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Delete message (only own messages)
  const handleDeleteMessage = async (id: string) => {
    const chatMembers = [userCred?.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");
    try {
      await deleteDoc(doc(db, "chat", uniqueChatId, "messages", id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Audio recording handlers
  useEffect(() => {
    if (!isRecording) {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      return;
    }

    const handleSuccess = (stream: MediaStream) => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      };

      recorder.start();
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(handleSuccess)
      .catch((err) => {
        console.error("Could not start audio recording", err);
        setIsRecording(false);
      });

    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, [isRecording]);

  // Render each message
  const renderMessage = (message: Message) => (
    <Message
      key={message.id}
      isOwnMessage={message.isOwnMessage}
      title={message.time}
    >
      <MessageBubble isOwnMessage={message.isOwnMessage}>
        {message.text && <div>{message.text}</div>}

        {message.imageUrl && (
          <ImagePreview src={message.imageUrl} alt="Sent Image" />
        )}

        {message.audioUrl && <AudioPlayer controls src={message.audioUrl} />}

        {message.isOwnMessage && (
          <DeleteButton
            aria-label="delete"
            onClick={() => handleDeleteMessage(message.id)}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </DeleteButton>
        )}

        <TimeStamp isOwnMessage={message.isOwnMessage}>
          {message.time}
        </TimeStamp>
      </MessageBubble>
    </Message>
  );

  return (
    <Container>
      <Header>
        <UserInfo>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Avatar src={user?.photoUrl || ""} alt={user?.fullName || "User"} />
          <UserDetails>
            <UserName>{user?.fullName || "Unknown"}</UserName>
            <UserStatus> "Offline"</UserStatus>
          </UserDetails>
        </UserInfo>
        <ActionIcons>
          <Tooltip title="Call">
            <IconButton>
              <PhoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video Call">
            <IconButton>
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
        </ActionIcons>
      </Header>

      <MessagesContainer>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="upload-image"
        />
        <label htmlFor="upload-image">
          <IconButton component="span" color="primary" size="large">
            <ImageIcon />
          </IconButton>
        </label>

        <RecordButton
          $isRecording={isRecording}
          onClick={() => setIsRecording((prev) => !prev)}
          aria-label={isRecording ? "Stop recording" : "Record audio"}
          size="large"
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </RecordButton>

        <InputField
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <SendButton
          onClick={sendMessage}
          size="large"
          aria-label="Send message"
        >
          <SendIcon />
        </SendButton>
      </InputContainer>

      {audioURL && <AudioPlayer controls src={audioURL} />}

      {imagePreviewUrl && <ImagePreview src={imagePreviewUrl} alt="Preview" />}
    </Container>
  );
};

export default ChatPage;
