import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: var(--background-light);
`;

const MessageItem = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-grey);
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

const Name = styled.h2`
  font-size: 16px;
  margin-bottom: 5px;
  color: var(--text-dark); /* Use dark text color */
`;

const MessagePreview = styled.p`
  font-size: 14px;
  color: var(--color-grey);
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: var(--color-grey);
`;

const NewBadge = styled.span`
  background-color: var(--color-orange);
  color: var(--text-light);
  padding: 5px;
  border-radius: 5px;
  font-size: 10px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function MessageList() {
  const navigate = useNavigate();
  return (
    <MessageListContainer>
      <MessageItem onClick={() => navigate("/chatpage")}>
        <MessageDetails>
          <Avatar src="/Logo.png" alt="Anna's avatar" />
          <div>
            <Name>Anna</Name>
            <MessagePreview>Yay!</MessagePreview>
          </div>
        </MessageDetails>
        <StyledDiv>
          <NewBadge>NEW</NewBadge>
          <Timestamp>09:31</Timestamp>
        </StyledDiv>
      </MessageItem>
      <MessageItem onClick={() => navigate("/chatpage")}>
        <MessageDetails>
          <Avatar
            src="https://lh3.googleusercontent.com/a/ACg8ocLn2jt8_7doj3-_uHr_MyMFlA-PeFQklZCbkQ6xoHsmWFnB1epn=s96-c"
            alt="Anna's avatar"
          />
          <div>
            <Name>Anna</Name>
            <MessagePreview>Yay!</MessagePreview>
          </div>
        </MessageDetails>
        <StyledDiv>
          <NewBadge>NEW</NewBadge>
          <Timestamp>09:31</Timestamp>
        </StyledDiv>
      </MessageItem>
    </MessageListContainer>
  );
}
