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
      (querySnapshot) => {
        const messagesData: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
            id: doc.id,
            text: data.text || "",
            imageUrl: data.imageUrl || "",
            audioUrl: data.audioUrl || "",
            time: data.timestamp
              ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString()
              : "",
            isOwnMessage: data.sender === userCred.uid,
          });
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

  // Handle image upload and preview
  const handleImageUploadAndPreview = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<string | null> => {
    const file = event.target.files?.[0];
    if (!file) return null;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `images/${file.name}-${timestamp}`);

      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage && !audioBlob) return;

    if (!userCred?.uid || !chatid) {
      alert("User not authenticated or chat id missing.");
      return;
    }

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    let imageUrl = "";
    if (selectedImage) {
      // If image preview url exists, we already uploaded the image so can use it
      if (imagePreviewUrl) {
        imageUrl = imagePreviewUrl;
      } else {
        const uploadedUrl = await handleImageUploadAndPreview({
          target: { files: [selectedImage] },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
    }

    let audioUrl = "";
    if (audioBlob) {
      try {
        const storage = getStorage();
        const timestamp = Date.now();
        const audioRef = ref(
          storage,
          `audio/${userCred.uid}-${timestamp}.webm`
        );

        const snapshot = await uploadBytes(audioRef, audioBlob);
        audioUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    }

    try {
      const messagesCollectionRef = collection(
        db,
        "chatMessage",
        uniqueChatId,
        "messages"
      );
      await addDoc(messagesCollectionRef, {
        sender: userCred.uid,
        text: newMessage.trim() || "",
        imageUrl: imageUrl || "",
        audioUrl: audioUrl || "",
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

  // Handle text input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  // Handle Delete Message
  const handleDeleteMessage = async (id: string) => {
    if (!chatid || !userCred?.uid) return;

    const chatMembers = [userCred.uid, chatid].sort();
    const uniqueChatId = chatMembers.join("_");

    try {
      const messageDocRef = doc(
        db,
        "chatMessage",
        uniqueChatId,
        "messages",
        id
      );
      await deleteDoc(messageDocRef);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Audio Recording Handlers
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording is not supported on this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        chunks = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Navigate back handler
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <Header>
        <Tooltip title="Back">
          <IconButton onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>
        <UserInfo>
          <Avatar alt={user?.fullName || ""} src={user?.photoUrl || ""} />
          <UserDetails>
            <UserName>{user?.fullName || "Unknown User"}</UserName>
            <UserStatus>Online</UserStatus>
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
        {messages.map(
          ({ id, text, imageUrl, audioUrl, time, isOwnMessage }) => (
            <Message key={id} isOwnMessage={isOwnMessage}>
              <MessageBubble isOwnMessage={isOwnMessage}>
                {text && <div>{text}</div>}
                {imageUrl && <ImagePreview src={imageUrl} alt="Sent image" />}
                {audioUrl && <AudioPlayer controls src={audioUrl} />}
                <TimeStamp isOwnMessage={isOwnMessage}>{time}</TimeStamp>

                {isOwnMessage && (
                  <DeleteButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleDeleteMessage(id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </DeleteButton>
                )}
              </MessageBubble>
            </Message>
          )
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <IconButton
          component="label"
          title="Attach Image"
          sx={{ color: "var(--color-blue)" }}
        >
          <ImageIcon />
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageUploadAndPreview}
          />
        </IconButton>

        {imagePreviewUrl && (
          <ImagePreview src={imagePreviewUrl} alt="Preview" />
        )}

        <InputField
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <RecordButton
          $isRecording={isRecording}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          title={isRecording ? "Stop Recording" : "Record Audio"}
        >
          {isRecording ? <StopIcon /> : <MicIcon />}
        </RecordButton>

        <SendButton aria-label="send" onClick={handleSendMessage}>
          <SendIcon />
        </SendButton>
      </InputContainer>

      {audioURL && <AudioPlayer controls src={audioURL} />}
    </Container>
  );
};

export default ChatPage;
