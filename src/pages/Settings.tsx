// SettingsPage.tsx

import React, { useState } from "react";
import styled from "styled-components";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "../ui/Button"; // Import the reusable Button component
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/db";
import { useUser } from "../hook/useUser";

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 16px;
  background-color: var(--background-light);
  color: var(--text-dark); /* Use CSS variable for text color */
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  text-align: left;
  font-size: 24px;
  margin-bottom: 16px;
  color: var(--primary-color); /* Use CSS variable for primary color */
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--background-light); /* Use CSS variable */
  margin-bottom: 16px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  div {
    display: flex;
  }

  /* Dark Mode Styles */
  body.dark-mode & {
    background-color: var(--background-dark);
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const AvatarFallback = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  margin-right: 10px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.span`
  font-weight: bold;
  color: var(--text-dark); /* Use CSS variable for text color */

  /* Dark Mode Styles */
  body.dark-mode & {
    color: var(--text-light);
  }
`;

const ProfileEditText = styled.span`
  color: var(--color-grey); /* Use CSS variable */
  font-size: 14px;

  /* Dark Mode Styles */
  body.dark-mode & {
    color: var(--color-grey);
  }
`;

const MenuSection = styled.div`
  background-color: var(--background-light);
  color: var(--text-dark);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);

  /* Dark Mode Styles */
  body.dark-mode & {
    background-color: var(--background-dark);
    color: var(--text-light);
  }
`;

const MenuItem = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid var(--color-grey);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--background-hover);
  }

  /* Dark Mode Styles */
  body.dark-mode & {
    border-bottom: 1px solid var(--color-grey);
  }
`;

const StyledArrowForwardIcon = styled(ArrowForwardIosIcon)`
  color: var(--color-grey);
  font-size: 18px;

  /* Dark Mode Styles */
  body.dark-mode & {
    color: var(--color-grey);
  }
`;

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: user } = useUser();
  const { user: userCred } = user;

  const [isLoading, setIsLoading] = useState(false);

  function handleSignOut() {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        localStorage.removeItem("userToken");
        setIsLoading(false);
        navigate("/Login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        setIsLoading(false);
      });
  }

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <Container>
      <Header>Settings</Header>
      <ThemeToggle />
      <ProfileSection onClick={() => navigate("/app/editProfile")}>
        <div>
          {userCred?.photoUrl ? (
            <Avatar src={userCred?.photoUrl as string} alt="Profile Image" />
          ) : (
            <AvatarFallback>
              {getInitials(userCred?.fullName || "User")}
            </AvatarFallback>
          )}
          <ProfileDetails>
            <ProfileName>{userCred?.fullName || "Unknown User"}</ProfileName>
            <ProfileEditText>Edit your profile</ProfileEditText>
          </ProfileDetails>
        </div>
        <StyledArrowForwardIcon />
      </ProfileSection>

      <MenuSection>
        <MenuItem>
          <span>Language</span>
          <StyledArrowForwardIcon />
        </MenuItem>
        <MenuItem>
          <span>Notifications</span>
          <StyledArrowForwardIcon />
        </MenuItem>
        <MenuItem>
          <span>Settings</span>
          <StyledArrowForwardIcon />
        </MenuItem>
        <MenuItem onClick={() => navigate("/support")}>
          <span>Support</span>
          <StyledArrowForwardIcon />
        </MenuItem>
      </MenuSection>

      <Button variant="danger" disabled={isLoading} onClick={handleSignOut}>
        Sign out
      </Button>
    </Container>
  );
};

export default SettingsPage;
