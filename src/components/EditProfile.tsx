// src/components/EditProfile.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hook/useUser";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/db";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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
const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { state: user } = useUser();
  const { user: userCred } = user;

  const [fullname, setFullname] = useState(userCred?.fullName || "");
  const [email, setEmail] = useState(userCred?.email || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(
    function () {
      if (userCred) {
        setEmail(userCred?.email as string);
        setFullname(userCred?.fullName as string);
      }
    },
    [userCred]
  );
  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement> | undefined
  ) {
    if (e?.target?.files && e?.target?.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  }
  async function handleSaveChanges() {
    if (!userCred?.uid) {
      console.error("User ID is not defined");
      return; // Handle the case where the user is not logged in or userCred is undefined
    }

    const userRef = doc(db, "users", userCred.uid);
    const userDoc = await getDoc(userRef);
    let photoUrl: string | null = userCred.photoUrl;

    if (!userDoc.exists()) {
      console.error("No document found for user ID:", userCred.uid);
      return;
    }
    if (profileImage) {
      const storageRef = ref(getStorage(), `profileImages/${userCred.uid}`);
      await uploadBytes(storageRef, profileImage);
      photoUrl = await getDownloadURL(storageRef);
    }

    try {
      await updateDoc(userRef, {
        fullName: fullname,
        email: email,
        photoUrl: photoUrl,
      });
      console.log("User profile updated successfully.");
      navigate("/app/Settings");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  }

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <Container>
      <Header>
        <Title>Edit Profile</Title>
        <CancelButton onClick={() => navigate("/app/Settings")}>
          Cancel
        </CancelButton>
      </Header>

      <AvatarSection>
        {userCred?.photoUrl ? (
          <Avatar src={userCred?.photoUrl as string} alt="Profile Image" />
        ) : (
          <AvatarFallback>
            {getInitials(userCred?.fullName || "User")}
          </AvatarFallback>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="profileImageInput"
          onChange={(e) => handleImageChange(e)}
        />
        <label htmlFor="profileImageInput">
          <ChangeText>Change profile picture</ChangeText>
        </label>
      </AvatarSection>

      <InputSection>
        <Input
          label="Full name"
          name="firstName"
          placeholder="Full name"
          onChange={(e) => setFullname(e.target.value)}
          defaultValue={userCred?.fullName}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          defaultValue={userCred?.email as string}
        />
      </InputSection>

      <Button variant="primary" onClick={handleSaveChanges}>
        Save changes
      </Button>
    </Container>
  );
};

export default EditProfile;
