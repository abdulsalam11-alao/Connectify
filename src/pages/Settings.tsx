import React from "react";
import styled from "styled-components";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Button from "../ui/Button"; // Import the reusable Button component
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 16px;
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  text-align: left;
  font-size: 24px;
  margin-bottom: 16px;
  color: var(--primary-color);
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 16px;
  margin-left: 0px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  div {
    display: flex;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.span`
  font-weight: bold;
  color: var(--text-dark);
`;

const ProfileEditText = styled.span`
  color: var(--color-grey);
  font-size: 14px;
`;

const MenuSection = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--background-light);
  }
`;

// Styled forward arrow icon
const StyledArrowForwardIcon = styled(ArrowForwardIosIcon)`
  color: var(--color-grey);
  font-size: 18px;
`;

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Header>Settings</Header>
      <ProfileSection onClick={() => navigate("/app/editProfile")}>
        <div>
          <Avatar src="https://via.placeholder.com/50" alt="Profile" />
          <ProfileDetails>
            <ProfileName>Yana Petrov</ProfileName>
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
        <MenuItem>
          <span>Support</span>
          <StyledArrowForwardIcon />
        </MenuItem>
      </MenuSection>

      <Button variant="danger">Sign out</Button>
    </Container>
  );
};

export default SettingsPage;
