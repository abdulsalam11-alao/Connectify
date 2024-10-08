import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../firebase/db";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../ui/Loader";
import { User } from "../context/UserContext";

// Styled Components for the Profile Page
const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = useState(true); // Start loading state as true
  const [user, setUser] = useState<User | null>(Object);

  async function getUser() {
    if (userId) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      setUser(userDoc.data() as User);
    } else {
      console.error("User ID is undefined");
    }
    setIsLoading(false); // Set loading to false after fetching user data
  }

  useEffect(() => {
    getUser();
  }, [userId]); // Ensure to call getUser only when userId changes

  if (!user)
    return (
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Title>User Not Found</Title>
            <p>The profile you're trying to view does not exist.</p>
            <BackButton onClick={() => window.history.back()}>Back</BackButton>
          </>
        )}
      </Container>
    );

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("");
    };

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Title>{user.fullName}'s Profile</Title>
          <div>
            {user?.photoUrl ? (
              <Avatar src={user?.photoUrl as string} alt="Profile Image" />
            ) : (
              <AvatarFallback>
                {getInitials(user?.fullName || "User")}
              </AvatarFallback>
            )}
          </div>
          <UserInfo>
            <Label>Name:</Label> {user.fullName}
          </UserInfo>
          <UserInfo>
            <Label>Email:</Label> {user.email}
          </UserInfo>

          <BackButton onClick={() => window.history.back()}>Back</BackButton>
        </>
      )}
    </Container>
  );
};

export default ProfilePage;
