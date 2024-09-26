import React from "react";
import { useTheme } from "../context/ThemeContext";
import styled from "styled-components";
import { IconButton } from "@mui/material"; // If using MUI
import { WbSunny, NightsStay } from "@mui/icons-material";

const ToggleButton = styled(IconButton)`
  color: var(--color-grey);
  padding: 10px;
  margin-top: 20px;

  &:hover {
    color: var(--primary-color);
  }
`;

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme}>
      {isDarkMode ? <WbSunny /> : <NightsStay />}
    </ToggleButton>
  );
};

export default ThemeToggle;
