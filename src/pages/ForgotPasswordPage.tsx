import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // Import Firebase functions

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: var(--primary-color);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--color-grey);
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-red);
  font-size: 14px;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  color: var(--color-green);
  font-size: 14px;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  background-color: var(--color-grey);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase auth

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    // Send password reset email via Firebase
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Success message
        setSuccessMessage("A password reset link has been sent to your email.");
        setEmail(""); // Clear the input field
      })
      .catch((error) => {
        // Handle errors here
        setErrorMessage(
          error.code === "auth/user-not-found"
            ? "No user found with this email."
            : "Failed to send reset email. Please try again."
        );
      });
  };

  return (
    <Container>
      <Title>Forgot Password</Title>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SubmitButton type="submit">Send Reset Link</SubmitButton>
      </Form>

      <BackButton onClick={() => navigate(-1)}>Back</BackButton>
    </Container>
  );
};

export default ForgotPasswordPage;
