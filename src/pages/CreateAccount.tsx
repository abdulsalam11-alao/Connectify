import { useState } from "react";
import styled from "styled-components";
import Input from "../ui/Input";
import Button from "../ui/Button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SocialButton from "../ui/SocialButton"; // Reusable SocialButton component
import { Link, useNavigate } from "react-router-dom";

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

const StyledArrowBackIcon = styled(ArrowBackIcon)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 40px;
  color: aliceblue;
`;

export default function CreateAccount({}: Props) {
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
      <StyledArrowBackIcon onClick={() => navigate(-1)} />

      <img src="/signUp.jpg" alt="SignUp" />
      <StyledSection>
        <StyledH1>Create Account</StyledH1>
        <Input label="Full Name" type="text" required />
        <Input label="Email" type="email" required />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
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

        <p>
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>

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
