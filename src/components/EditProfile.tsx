// src/components/EditProfile.tsx
import React from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Input from "../ui/Input";
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0;
  color: var(--text-dark);
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: var(--color-grey);
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: var(--primary-color);
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
  cursor: pointer;
`;

const ChangeText = styled.span`
  color: var(--color-grey);
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: var(--primary-color);
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
`;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Header>
        <Title>Edit Profile</Title>
        <CancelButton onClick={() => navigate("/app/Settings")}>
          Cancel
        </CancelButton>
      </Header>

      <AvatarSection>
        <Avatar src="https://via.placeholder.com/80" alt="Profile" />
        <ChangeText>Change profile picture</ChangeText>
      </AvatarSection>

      <InputSection>
        <Input label="Full name" name="firstName" placeholder="Full name" />

        <Input label="Email" type="email" name="email" placeholder="Email" />
      </InputSection>

      <Button variant="primary">Save changes</Button>
    </Container>
  );
};

export default EditProfile;
