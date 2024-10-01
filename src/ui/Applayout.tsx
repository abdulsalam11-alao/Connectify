// src/components/Applayout.tsx
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Footer from "./Footer";
import { db } from "../firebase/db"; // Adjust the import according to your project structure
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useUser } from "../hook/useUser";

// Styled Components
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default function Applayout() {
  const userToken = localStorage.getItem("userToken");

  const { handleCreateAction } = useUser();

  let email: string | null = null;
  if (userToken) {
    const obj = JSON.parse(userToken);
    email = obj?.email;
    console.log("Logged in user's email:", email);
  }

  function GetCurrentUsers() {
    const usersRef = collection(db, "users");

    getDocs(usersRef)
      .then((snapshot) => {
        let matchedUser = null;
        snapshot.forEach((user) => {
          const userData = user.data();
          if (userData.email === email) {
            matchedUser = userData;
          }
        });

        if (matchedUser) {
          handleCreateAction(matchedUser);
        } else {
          console.log("No user found with the email:", email);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  useEffect(() => {
    if (email) {
      GetCurrentUsers(); // Fetch users only if email exists
    }
  }, [email]);

  return (
    <Container>
      <Outlet />
      <Footer />
    </Container>
  );
}
