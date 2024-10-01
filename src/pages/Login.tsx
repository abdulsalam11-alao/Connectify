import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import Input from "../ui/Input";
import Button from "../ui/Button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SocialButton from "../ui/SocialButton";
import { useNavigate } from "react-router-dom";
// import { validateEmail, validatePassword } from "../util/formValidation";
import {
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { getFriendlyErrorMessage } from "../ErrorMessage";
import { auth, provider } from "../firebase/db";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: var(--background-light);
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

const StyledSection = styled.section`
  padding: 20px;
  width: 100%;
`;

const StyledH1 = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 20px;
  text-align: center;
`;

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 40px;
  color: var(--primary-color);
  &:hover {
    color: var(--primary-color-dark);
  }
`;

const StyledImg = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ForgotPasswordText = styled.p`
  font-size: 14px;
  color: var(--color-grey);
  margin: 10px 0;
  text-align: center;

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: var(--primary-color-dark);
    }
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: var(--color-red);
  margin-top: 5px;
  text-align: center;
`;

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Email Validation
  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailPattern.test(email));
  };

  // Password Validation
  const validatePassword = (password: string) => {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    setPasswordValid(passwordPattern.test(password));
  };

  // Handle Email Change
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Handle Password Change
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // Handle Form Submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!emailValid || !passwordValid) {
      setAuthError("Please fix the errors above before submitting.");
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userToken = localStorage.getItem("userToken");

        if (userToken) {
          const obj = JSON.parse(userToken);
          const newobj = {
            ...obj,
            token: user.refreshToken,
            email: user.email,
          };
          localStorage.setItem("userToken", JSON.stringify({ ...newobj }));
          setAuthError("");

          navigate("/app/chat");
        } else {
          const newobj = {
            token: user.refreshToken,
            email: user.email,
          };
          localStorage.setItem("userToken", JSON.stringify({ ...newobj }));
          setAuthError("");

          navigate("/app/chat");
        }
      })
      .catch((error) => {
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        console.log(error.message);
        setAuthError(friendlyMessage);
      })
      .finally(() => setIsLoading(false));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const GoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    signInWithPopup(auth, provider)
      .then((result) => {
        provider.setCustomParameters({
          display: "popup",
        });

        const user = result.user;
        const userToken = localStorage.getItem("userToken");

        if (userToken) {
          const obj = JSON.parse(userToken);
          const newobj = {
            ...obj,
            token: user.refreshToken,
            email: user.email,
          };
          localStorage.setItem("userToken", JSON.stringify({ ...newobj }));
          setAuthError("");

          navigate("/app/chat");
        } else {
          const newobj = {
            token: user.refreshToken,
            email: user.email,
          };
          localStorage.setItem("userToken", JSON.stringify({ ...newobj }));
          setAuthError("");

          navigate("/app/chat");
        }

        // Clear any previous errors
      })
      .catch((error) => {
        const friendlyMessage = getFriendlyErrorMessage(error.code);
        console.log(error.message);
        setAuthError(friendlyMessage);
      })
      .finally(() => {});
  };
  const faceBookSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    signInWithPopup(auth, new FacebookAuthProvider())
      .then((result) => {
        const provider = new FacebookAuthProvider();
        provider.setCustomParameters({
          display: "popup",
        });
        const user = result.user;

        const credential = FacebookAuthProvider?.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        const userToken = localStorage.getItem("userToken");

        if (userToken) {
          const obj = JSON.parse(userToken);
          const newobj = {
            ...obj,
            token: user.refreshToken,
            email: user.email,
          };
          localStorage.setItem("userToken", JSON.stringify({ ...newobj }));
          setAuthError("");

          navigate("/app/chat");
        } else {
          const newobj = {
            token: user.refreshToken,
            email: user.email,
          };
          localStorage.setItem("userToken", JSON.stringify({ ...newobj }));
          setAuthError("");

          navigate("/app/chat");
        }

        setAuthError("");
      })
      .catch((error) => {
        const friendlyMessage = getFriendlyErrorMessage(error.code);

        setAuthError(friendlyMessage);
      })
      .finally(() => {
        setIsLoading(false);

        navigate("/app/chat");
      });
  };
  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledArrowBackIcon onClick={() => navigate(-1)} aria-label="Go back" />

      <StyledImg src="/SignIn.png" alt="login-image" />

      <StyledSection>
        <StyledH1>Sign in</StyledH1>
        <Input
          label="Email"
          type="email"
          name="email"
          required
          value={email}
          onChange={handleEmailChange}
          error={emailValid ? "" : "Invalid email address"}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          required
          name="password"
          value={password}
          onChange={handlePasswordChange}
          error={
            passwordValid
              ? ""
              : "Must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
          }
        />
        {authError && <ErrorText>{authError}</ErrorText>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <ForgotPasswordText>
          Forgot your password? <a href="/forgot-password">Reset it</a>
        </ForgotPasswordText>

        <SocialButton
          backgroundColor="#db4437"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => GoogleSignIn(e)}
          icon={<GoogleIcon />}
          label="Sign in with Google"
          disabled={isLoading}
        />
        <SocialButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            faceBookSignIn(e)
          }
          icon={<FacebookIcon />}
          label="Sign in with Facebook"
          backgroundColor="#4267b2"
          disabled={isLoading}
        />
      </StyledSection>
    </StyledForm>
  );
}
