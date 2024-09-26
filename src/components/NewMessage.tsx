import React, { useState } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
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
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: var(--text-dark);
  font-size: 18px;
`;

const CancelButton = styled(IconButton)`
  color: var(--color-grey);
`;

const InputField = styled.input`
  padding: 10px;
  border: 1px solid var(--color-grey-light);
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  margin-bottom: 16px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const SuggestedList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SuggestedTitle = styled.h4`
  margin: 0;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const SuggestedItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }

  &:hover {
    background-color: #f8f8f8;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const NewMessagePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const suggestedUsers = [
    { name: "Anna", imageUrl: "https://via.placeholder.com/40" },
    { name: "Sylvester", imageUrl: "https://via.placeholder.com/40" },
  ];

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <Title>New Message</Title>
        <CancelButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </CancelButton>
      </Header>

      {/* Search Input Field */}
      <InputField
        type="text"
        placeholder="To"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Suggested Users List */}
      <SuggestedTitle>Suggested</SuggestedTitle>
      <SuggestedList>
        {suggestedUsers.map((user, index) => (
          <SuggestedItem key={index}>
            <Avatar alt={user.name} src={user.imageUrl} />
            <UserInfo>
              <UserName>{user.name}</UserName>
            </UserInfo>
          </SuggestedItem>
        ))}
      </SuggestedList>
    </Container>
  );
};

export default NewMessagePage;
