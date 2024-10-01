import React from "react";
import styled from "styled-components";
import Visibility from "@mui/icons-material/Visibility"; // Import visibility icon
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import visibility off icon

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  name?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  position: relative;
`;

const Label = styled.label`
  font-size: 20px;
  color: var(--text-dark);
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  width: 100%; /* Make the input take full width */

  &:focus {
    border-color: var(--color-blue);
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: var(--color-red);
  margin-top: 5px;
`;

const ToggleVisibilityButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 80%;
  transform: translateY(-50%);
  color: var(--text-dark);
`;

const Input: React.FC<InputProps> = ({
  label,
  error,
  showPassword,
  togglePasswordVisibility,
  ...props
}) => {
  return (
    <Container>
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <StyledInput
        id={props.name}
        {...props}
        type={showPassword ? "text" : props.type}
      />
      {showPassword !== undefined && togglePasswordVisibility && (
        <ToggleVisibilityButton
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </ToggleVisibilityButton>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Input;
