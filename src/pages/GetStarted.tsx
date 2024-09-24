import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Container for the entire GetStarted page
const Container = styled.div`
  width:100%;
  padding: 20px;
  background-color: var(--background-light);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* Relative positioning for child elements */
`;

// Styled image
const StyledImage = styled.img`
  width: 100%; /* Full width of the container */
  height: auto; /* Maintain aspect ratio */
  padding: 20px; /* Padding around the image */
`;

// Title styling
const Title = styled.h1`
  font-size: 24px; /* Title font size */
  color: var(--primary-color); /* Use primary color */
  margin-bottom: 10px; /* Space below the title */
  text-align: center; /* Center align text */
`;

// Description styling
const Description = styled.p`
  font-size: 16px; /* Description font size */
  color: var(--text-color); /* Text color */
  text-align: center; /* Center align text */
  margin-bottom: 30px; /* Space below the description */
`;

// Button styling
const Button = styled.button`
  background-color: var(--primary-color); /* Use primary color */
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
  margin-top: 20px;
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
        src="./GetStarted.jpeg"
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
