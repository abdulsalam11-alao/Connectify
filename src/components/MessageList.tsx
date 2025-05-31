import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hook/useUser";
import FullPageSpinner from "../ui/FullPageSpinner";
import { formatTimestamp, getInitials, isMessageUnread } from "../util/helpers";
import { useRealTimeChats } from "../hook/useRealTimeChats";

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: var(--background-light);
`;

const MessageItem = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-grey);
  cursor: pointer;
`;

// ... Other styled components remain the same

export default function MessageList() {
  const navigate = useNavigate();
  const { state } = useUser();
  const { user: UserCred } = state;

  // Use the custom hook here
  const { otherUsers, loading } = useRealTimeChats(UserCred?.uid);

  if (loading) return <FullPageSpinner />;
  if (!otherUsers.length) return <p>No chats available</p>;

  return (
    <MessageListContainer>
      {otherUsers.map((others) => (
        <MessageItem
          key={others.uid}
          onClick={() => navigate(`/chatpage/${others.uid}/${others.ref.id}`)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {others.photoUrl ? (
              <img
                src={others.photoUrl}
                alt={others.fullName}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginRight: 10,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/newMessage/profile/${others.uid}`)}
              />
            ) : (
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-color)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/newMessage/profile/${others.uid}`)}
              >
                {getInitials(others.fullName || "User")}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2>{others.fullName}</h2>
            <p>
              {others.lastMessage.length > 30
                ? others.lastMessage.slice(0, 30) + "..."
                : others.lastMessage || "No messages yet."}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            {isMessageUnread(others.lastMessageTime, others.lastRead) && (
              <span
                style={{
                  backgroundColor: "orange",
                  color: "white",
                  borderRadius: 5,
                  padding: "2px 6px",
                  fontSize: 10,
                  marginRight: 5,
                }}
              >
                NEW
              </span>
            )}
            <span style={{ fontSize: 12, color: "#666" }}>
              {formatTimestamp(others.lastMessageTime)}
            </span>
          </div>
        </MessageItem>
      ))}
    </MessageListContainer>
  );
}
