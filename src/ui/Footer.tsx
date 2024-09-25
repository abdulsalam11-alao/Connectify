import ChatIcon from "@mui/icons-material/Chat";

import SettingsIcon from "@mui/icons-material/Settings";
import styled from "styled-components";
import { Link } from "react-router-dom";

const FooterNav = styled.footer`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #ddd;
`;

const NavIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
`;

export default function Footer() {
  return (
    <FooterNav>
      <Link to="/app/chat">
        <NavIcon>
          <ChatIcon style={{ fontSize: "30px" }} />
        </NavIcon>
      </Link>

      <Link to="/app/settings">
        <NavIcon>
          <SettingsIcon style={{ fontSize: "30px" }} />
        </NavIcon>
      </Link>
    </FooterNav>
  );
}
