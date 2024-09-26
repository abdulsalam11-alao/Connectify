import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  background-color: var(--background-light);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0; /* Ensure there's no margin */
`;

// Styled image
const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`;

// Title styling
const Title = styled.h1`
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 10px;
  text-align: center;
`;

// Description styling
const Description = styled.p`
  font-size: 16px;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 20px;
`;

// Button styling
const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;

  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

// Styled link
const StyledLink = styled(Link)`
  margin-top: 10px;
  color: var(--primary-color);
  font-size: 18px;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: var(--primary-color-dark);
    text-decoration: underline;
  }
`;

const GetStarted: React.FC = () => {
  return (
    <Container>
      <StyledImage
        src="./GetStartedImage.png"
        alt="Welcome to Connectify - Get Started"
      />
      <Title>Welcome to Connectify</Title>
      <Description>Conversations Made Easy</Description>
      <Link to="/Create-account">
        <Button>Get Started</Button>
      </Link>
      <StyledLink to="/login">I already have an account</StyledLink>
    </Container>
  );
};

export default GetStarted;
