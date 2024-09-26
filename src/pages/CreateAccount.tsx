import { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";
import Button from "../ui/Button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SocialButton from "../ui/SocialButton";
import { Link, useNavigate } from "react-router-dom";

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
  left: 10px;

  color: var(--text-light);
  &:hover {
    color: var(--primary-color-dark);
  }
`;

const StyledImg = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const AlreadyHaveAccountText = styled.p`
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

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <StyledForm>
      <StyledArrowBackIcon
        style={{ fontSize: "40px" }}
        onClick={() => navigate(-1)}
      />

      <StyledImg src="/signUp.jpg" alt="Sign Up Image" />

      <StyledSection>
        <StyledH1>Create Account</StyledH1>
        <Input label="Full Name" type="text" required />
        <Input label="Email" type="email" required />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          required
        />
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          showPassword={showConfirmPassword}
          togglePasswordVisibility={toggleConfirmPasswordVisibility}
          required
        />
        <Button>Create Account</Button>

        <AlreadyHaveAccountText>
          Already have an account? <Link to="/login">Sign in here</Link>
        </AlreadyHaveAccountText>

        <SocialButton
          backgroundColor="#db4437"
          icon={<GoogleIcon />}
          label="Sign up with Google"
          onClick={() => console.log("Google signup")}
        />
        <SocialButton
          backgroundColor="#4267b2"
          icon={<FacebookIcon />}
          label="Sign up with Facebook"
          onClick={() => console.log("Facebook signup")}
        />
      </StyledSection>
    </StyledForm>
  );
}
