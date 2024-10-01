import React from "react";
import styled from "styled-components";

interface SocialButtonProps {
  backgroundColor: string;
  icon: React.ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const StyledButton = styled.button<{ $backgroundColor: string }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 300px;
  padding: 12px;
  margin-top: 15px;
  margin-bottom: 15px;

  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background-color: ${(props) => props.$backgroundColor};
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const IconWrapper = styled.span`
  margin-right: 10px;
`;

const SocialButton: React.FC<SocialButtonProps> = ({
  backgroundColor,
  icon,
  label,
  onClick,
  disabled,
}) => {
  return (
    <StyledButton
      $backgroundColor={backgroundColor}
      onClick={onClick}
      disabled={disabled}
    >
      <IconWrapper>{icon}</IconWrapper>
      {label}
    </StyledButton>
  );
};

export default SocialButton;
