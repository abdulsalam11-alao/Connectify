// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

// Mock API call to fetch user data by ID (Replace this with a real API call)
const fetchUserData = (userId: string) => {
  const mockUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      bio: "Web Developer",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      bio: "Graphic Designer",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      bio: "Product Manager",
    },
  ];

  return mockUsers.find((user) => user.id === userId);
};

// Styled Components for the Profile Page
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

const UserInfo = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.span`
  font-weight: bold;
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

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from URL params
  const [user, setUser] = useState<any>(null); // State to store user data

  // Fetch user data on component mount
  useEffect(() => {
    if (userId) {
      const fetchedUser = fetchUserData(userId);
      setUser(fetchedUser);
    }
  }, [userId]);

  // Handle case where user is not found
  if (!user) {
    return (
      <Container>
        <Title>User Not Found</Title>
        <p>The profile you're trying to view does not exist.</p>
        <BackButton onClick={() => window.history.back()}>Back</BackButton>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{user.name}'s Profile</Title>
      <UserInfo>
        <Label>Name:</Label> {user.name}
      </UserInfo>
      <UserInfo>
        <Label>Email:</Label> {user.email}
      </UserInfo>
      <UserInfo>
        <Label>Bio:</Label> {user.bio}
      </UserInfo>

      <BackButton onClick={() => window.history.back()}>Back</BackButton>
    </Container>
  );
};

export default ProfilePage;
