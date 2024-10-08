// src/pages/PageNotFound.tsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: var(--background-light);
  color: var(--text-dark);
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 24px;
  margin-bottom: 32px;
`;

const HomeButton = styled(Link)`
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

const PageNotFound: React.FC = () => {
  return (
    <Container>
      <Title>404 - Page Not Found</Title>
      <Message>Sorry, the page you are looking for does not exist.</Message>
      <HomeButton to="/login">Go to Home</HomeButton>
    </Container>
  );
};

export default PageNotFound;
