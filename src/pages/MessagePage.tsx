import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SearchContainer from "../ui/SearchContainer";
import MessageList from "../components/MessageList";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-light);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
`;

const EditButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  padding: 5px;
  border-radius: 8px;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-color-dark);
  }

  svg {
    font-size: 30px;
    cursor: pointer;
  }
`;

// Main Component
const MessagesPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Messages</Title>
        <EditButton to="/edit">
          <EditIcon />
        </EditButton>
      </Header>
      <SearchContainer />
      <MessageList />
    </Container>
  );
};

export default MessagesPage;
