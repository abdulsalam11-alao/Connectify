import { useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import Input from "../ui/Input";
import Button from "../ui/Button";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SocialButton from "../ui/SocialButton";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase/db";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getFriendlyErrorMessage } from "../ErrorMessage";

// Styled Components
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

const ErrorText = styled.span`
  font-size: 14px;
  color: var(--color-red);
  margin-top: 5px;
  text-align: center;
`;

// Validation Utility Functions
const validateEmailUtil = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const validatePasswordUtil = (password: string): boolean => {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordPattern.test(password);
};

const validateNameUtil = (name: string): boolean => {
  return /^[a-zA-Z\s]{3,}$/.test(name.trim());
};

// Main Component
export default function CreateAccount() {
  const navigate = useNavigate();

  // State for input fields
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for validation errors
  const [fullnameError, setFullnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // State for authentication errors
  const [authError, setAuthError] = useState("");

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsloading] = useState(false);

  // Validation Functions
  const validateFullname = (value: string): boolean => {
    if (!validateNameUtil(value)) {
      setFullnameError(
        "Name must be at least 3 characters long and contain only letters and spaces"
      );
      return false;
    } else {
      setFullnameError("");
      return true;
    }
  };

  const validateEmailField = (value: string): boolean => {
    if (!validateEmailUtil(value)) {
      setEmailError("Invalid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePasswordField = (value: string): boolean => {
    if (!validatePasswordUtil(value)) {
      setPasswordError(
        "Password must contain at least one number, one uppercase and lowercase letter, and be at least 8 characters long"
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPasswordField = (value: string): boolean => {
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  // Handlers for input changes with validation
  const handleFullnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullname(value);
    validateFullname(value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmailField(value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePasswordField(value);
    // Also validate confirm password in case password was changed
    if (confirmPassword) {
      validateConfirmPasswordField(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPasswordField(value);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const isFullnameValid = validateFullname(fullname);
    const isEmailValid = validateEmailField(email);
    const isPasswordValid = validatePasswordField(password);
    const isConfirmPasswordValid =
      validateConfirmPasswordField(confirmPassword);

    if (
      isFullnameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      setIsloading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
          // Additional actions after sign-up (e.g., navigate or store user data)

          const userData = {
            uid: user.uid,
            fullName: fullname.trim(),
            email: user.email,
          };

          setAuthError("");
          setIsloading(false);

          navigate("/login");

          return setDoc(doc(db, "users", user.uid), userData);
        })
        .catch((error) => {
          const friendlyMessage = getFriendlyErrorMessage(error.code);
          console.log(error.message);
          setAuthError(friendlyMessage);
        })
        .finally(() => {
          setIsloading(false);
        });
    }
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
        console.log(user);
        // Clear any previous errors
        setAuthError("");

        const userData = {
          uid: user.uid,
          fullName: user.displayName as string,
          email: user.email,
          // Add any additional fields here
        };

        navigate("/login");

        return setDoc(doc(db, "users", user.uid), userData);
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
    setIsloading(true);

    signInWithPopup(auth, new FacebookAuthProvider())
      .then((result) => {
        const provider = new FacebookAuthProvider();
        provider.setCustomParameters({
          display: "popup",
        });
        const user = result.user;
        console.log(user);

        const credential = FacebookAuthProvider?.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        setAuthError("");

        const userData = {
          uid: user.uid,
          fullName: user.displayName as string,
          email: user.email,
          // Add any additional fields here
        };
        navigate("/login");

        return setDoc(doc(db, "users", user.uid), userData);
      })
      .catch((error) => {
        const friendlyMessage = getFriendlyErrorMessage(error.code);

        setAuthError(friendlyMessage);
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledArrowBackIcon
        style={{ fontSize: "40px" }}
        onClick={() => navigate(-1)}
        aria-label="Go back"
      />

      <StyledImg src="/signUp.jpg" alt="Sign Up Image" />

      <StyledSection>
        <StyledH1>Create Account</StyledH1>
        <Input
          label="Full Name"
          type="text"
          name="fullname"
          value={fullname}
          onChange={handleFullnameChange}
          required
          error={fullnameError}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
          error={emailError}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handlePasswordChange}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          required
          error={passwordError}
        />
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          showPassword={showConfirmPassword}
          togglePasswordVisibility={toggleConfirmPasswordVisibility}
          required
          error={confirmPasswordError}
        />

        {authError && <ErrorText>{authError}</ErrorText>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up" : "Sign Up"}
        </Button>
        <AlreadyHaveAccountText>
          Already have an account? <Link to="/login">Log in</Link>
        </AlreadyHaveAccountText>
      </StyledSection>

      <SocialButton
        backgroundColor="#db4437"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => GoogleSignIn(e)}
        icon={<GoogleIcon />}
        label="Sign up with Google"
        disabled={isLoading}
      />
      <SocialButton
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => faceBookSignIn(e)}
        icon={<FacebookIcon />}
        label="Sign up with Facebook"
        backgroundColor="#4267b2"
        disabled={isLoading}
      />
    </StyledForm>
  );
}
