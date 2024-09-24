// src/components/Button.tsx
import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"; // Button variants
  children: React.ReactNode; // Content inside the button
}

const StyledButton = styled.button<{ variant: string }>`
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s;

  background-color: ${({ variant }) =>
    variant === "primary"
      ? "var(--color-blue)"
      : variant === "secondary"
      ? "var(--color-grey)"
      : variant === "danger"
      ? "var(--color-red)"
      : "var(--color-blue)"};

  color: white;

  &:hover {
    background-color: ${({ variant }) =>
      variant === "primary"
        ? "darkblue"
        : variant === "secondary"
        ? "darkgrey"
        : variant === "danger"
        ? "darkred"
        : "darkblue"};
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
