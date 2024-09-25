import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Footer from "./Footer";

// Styled Components
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default function Applayout() {
  return (
    <Container>
      <Outlet />
      <Footer />
    </Container>
  );
}
