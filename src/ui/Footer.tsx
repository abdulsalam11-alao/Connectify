// Footer.tsx

import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Styled Components
const FooterNav = styled.footer`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: var(--background-light);
  border-top: 1px solid var(--color-grey);
  transition: background-color 0.3s ease, border-top 0.3s ease;

  /* Dark Mode Styles */
  body.dark-mode & {
    background-color: var(--background-dark);
    border-top: 1px solid var(--color-grey);
  }
`;

const NavIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: var(--text-dark);
  transition: color 0.3s ease;

  /* Dark Mode Styles */
  body.dark-mode & {
    color: var(--text-light);
  }

  &:hover {
    color: var(--primary-color);
  }

  /* Ensuring icons are visually consistent */
  svg {
    width: 30px;
    height: 30px;
  }
`;

export default function Footer() {
  return (
    <FooterNav>
      <Link to="/app/chat">
        <NavIcon>
          <ChatIcon />
        </NavIcon>
      </Link>

      <Link to="/app/settings">
        <NavIcon>
          <SettingsIcon />
        </NavIcon>
      </Link>
    </FooterNav>
  );
}
