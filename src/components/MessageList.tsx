// MessageList.tsx

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  Timestamp,
  DocumentReference,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { db } from "../firebase/db";
import { useUser } from "../hook/useUser";
import { UserWithRef } from "../context/UserContext";
import FullPageSpinner from "../ui/FullPageSpinner";

// Styled Components
const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: var(--background-light);
`;

const MessageItem = styled.div`
  width: 100%;
  height: auto; /* Adjusted to accommodate varying content */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-grey);
  cursor: pointer;
`;

const MessageDetails = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AvatarFallback = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
`;

const Name = styled.h2`
  font-size: 16px;
  margin-bottom: 5px;
  color: var(--text-dark);
`;

const MessagePreview = styled.p`
  font-size: 14px;
  color: var(--color-grey);
  margin: 0;
`;

const StyledTimestamp = styled.span`
  font-size: 12px;
  color: var(--color-grey);
`;

const NewBadge = styled.span`
  background-color: var(--color-orange);
  color: var(--text-light);
  padding: 5px;
  border-radius: 5px;
  font-size: 10px;
  margin-right: 5px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// Helper Functions
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
};

const formatTimestamp = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const isMessageUnread = (lastMessageTime: Timestamp, lastRead?: Timestamp) => {
  if (!lastRead) return true; // If lastRead is not available, consider the message as unread
  return lastMessageTime.toMillis() > lastRead.toMillis();
};

export default function MessageList() {
  const navigate = useNavigate();
  const { state, setOtherUsers } = useUser();
  const { user: UserCred, otherUsers = [] } = state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!UserCred?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const chatRef = collection(db, "chat");
    const q = query(
      chatRef,
      where("member", "array-contains", UserCred.uid),
      orderBy("lastMessageTime", "desc") // Order by lastMessageTime for recent chats
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        if (querySnapshot.empty) {
          setOtherUsers([]);
          setLoading(false);
          return;
        }

        const userPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const members: string[] = data.member;
          const otherMemberId = members.find((id) => id !== UserCred.uid);

          if (!otherMemberId) return null;

          const userRef = doc(db, "users", otherMemberId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserWithRef;

            return {
              ...userData,
              ref: docSnapshot.ref as DocumentReference,
              lastMessage: data.lastMessage || "",
              lastMessageTime: data.lastMessageTime as Timestamp,
              lastRead: data.lastRead?.[UserCred.uid] || null, // Fetch lastRead time for this user
            } as UserWithRef;
          }
          return null;
        });

        const fetchedUsers = await Promise.all(userPromises);

        const validUsers = fetchedUsers.filter(
          (user): user is UserWithRef =>
            user !== null &&
            user.ref !== undefined &&
            user?.lastMessage !== undefined &&
            user?.lastMessageTime !== undefined
        );

        setOtherUsers(validUsers);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chat data: ", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [UserCred]);

  if (loading) {
    return <FullPageSpinner />;
  }
  if (otherUsers.length === 0) {
    return <p>No users found.</p>;
  }
  return (
    <MessageListContainer>
      {otherUsers.map((others) => (
        <MessageItem
          key={others.uid} // Use uid for uniqueness
          onClick={() => navigate(`/chatpage/${others.uid}/${others.ref.id}`)}
        >
          <MessageDetails>
            <div
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                navigate(`/newMessage/profile/${others.uid}`);
              }}
            >
              {others.photoUrl ? (
                <Avatar src={others.photoUrl} alt={others.fullName} />
              ) : (
                <AvatarFallback>
                  {getInitials(others.fullName || "User")}
                </AvatarFallback>
              )}
            </div>
            <div style={{ marginLeft: "10px" }}>
              <Name>{others.fullName}</Name>
              <MessagePreview>
                {others.lastMessage.length > 30
                  ? `${others.lastMessage.slice(0, 30)}...`
                  : others.lastMessage || "No messages yet."}
              </MessagePreview>
            </div>
          </MessageDetails>
          <StyledDiv>
            {isMessageUnread(others.lastMessageTime, others.lastRead) && (
              <NewBadge>NEW</NewBadge>
            )}
            <StyledTimestamp>
              {others.lastMessageTime
                ? formatTimestamp(others.lastMessageTime)
                : ""}
            </StyledTimestamp>
          </StyledDiv>
        </MessageItem>
      ))}
    </MessageListContainer>
  );
}
