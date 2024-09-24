import React, { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";
import Button from "../ui/Button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SocialButton from "../ui/SocialButton"; // Import the reusable SocialButton component

import { useNavigate } from "react-router-dom";

type Props = {};

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const StyledSection = styled.section`
  padding: 20px;
`;

const StyledH1 = styled.h1`
  font-size: 40px;
  font-weight: bold;
`;

// Styled arrow back icon
const StyledArrowBackIcon = styled(ArrowBackIcon)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 100px;
  color: aliceblue;
`;

export default function Login({}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledForm>
      <StyledArrowBackIcon onClick={() => navigate(-1)} />

      <img src="/login.jpeg" alt="login-Image" />
      <StyledSection>
        <StyledH1>Sign in</StyledH1>
        <Input label="email" type="email" required />
        <Input
          label="password"
          type="password"
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          required
        />
        <Button>Sign in</Button>

        <p>
          Forgot your password? <a href="/forgot-password">Reset it</a>
        </p>

        <SocialButton
          backgroundColor="#db4437"
          icon={<GoogleIcon />}
          label="Sign in with Google"
          onClick={() => console.log("Google login")}
        />
        <SocialButton
          backgroundColor="#4267b2"
          icon={<FacebookIcon />}
          label="Sign in with Facebook"
          onClick={() => console.log("Facebook login")}
        />
      </StyledSection>
    </StyledForm>
  );
}
