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
  transition: background-color 0.3s, box-shadow 0.2s;
  background-color: ${({ variant }) =>
    variant === "primary"
      ? "var(--primary-color)"
      : variant === "secondary"
      ? "var(--color-grey)"
      : variant === "danger"
      ? "var(--color-red)"
      : "var(--primary-color)"};
  color: white;

  &:hover {
    background-color: ${({ variant }) =>
      variant === "primary"
        ? "var(--primary-color-dark)"
        : variant === "secondary"
        ? "var(--color-grey-dark)"
        : variant === "danger"
        ? "var(--color-red-dark)"
        : "var(--primary-color-dark)"};
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); // Add focus ring
  }

  &:disabled {
    background-color: var(--color-grey-light);
    cursor: not-allowed;
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
