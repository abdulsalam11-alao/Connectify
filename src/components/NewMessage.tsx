import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/db";
import { collection, getDocs } from "firebase/firestore";
import Loader from "../ui/Loader";
import { useUser } from "../hook/useUser";

interface User {
  id: string;
  name: string;
  imageUrl: string;
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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
  font-size: 18px;
`;

const CancelButton = styled(IconButton)`
  color: var(--color-grey);
`;

const InputField = styled.input`
  padding: 10px;
  border: 1px solid var(--color-grey-light);
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  margin-bottom: 16px;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const SuggestedList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SuggestedTitle = styled.h4`
  margin: 0;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const SuggestedItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }

  &:hover {
    background-color: #f8f8f8;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const NewMessagePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state } = useUser();
  const { user } = state;

  const userToken = localStorage.getItem("userToken");
  let loggedInEmail: string | null = null;

  if (userToken) {
    const obj = JSON.parse(userToken);
    loggedInEmail = obj?.email;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const usersMap: { [key: string]: User } = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.uid;

          // Skip the logged-in user based on email
          if (data.email !== loggedInEmail) {
            if (!usersMap[userId]) {
              usersMap[userId] = {
                id: userId,
                name: data.fullName,
                imageUrl: data.photoUrl,
              };
            }
          }
        });

        const usersList = Object.values(usersMap);
        setSuggestedUsers(usersList);
        console.log(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInEmail]);

  const filteredUsers = suggestedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  function handlProfileClick(id: string) {
    navigate(`profile/${id}`);
  }
  function handleNewMessageChat(id: string) {
    navigate(`/chatpage/${id}/${id}_${user?.uid}`);
  }
  return (
    <Container>
      <Header>
        <Title>New Message</Title>
        <CancelButton onClick={() => navigate(-1)}>
          <CloseIcon />
        </CancelButton>
      </Header>

      <InputField
        type="text"
        placeholder="To"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SuggestedTitle>Suggested</SuggestedTitle>

      {loading ? (
        <Loader />
      ) : filteredUsers.length > 0 ? (
        <SuggestedList>
          {filteredUsers.map((user) => (
            <SuggestedItem key={user.id}>
              <Avatar
                alt={user.name}
                src={user.imageUrl}
                onClick={() => handlProfileClick(user.id)}
              />
              <UserInfo onClick={() => handleNewMessageChat(user.id)}>
                <UserName>{user.name}</UserName>
              </UserInfo>
            </SuggestedItem>
          ))}
        </SuggestedList>
      ) : (
        <p>No users found.</p>
      )}
    </Container>
  );
};

export default NewMessagePage;
