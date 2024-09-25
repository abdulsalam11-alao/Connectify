import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --color-blue: #007bff; /* Primary blue color */
    --color-purple: #6f42c1; /* Purple color */
    --color-pink: #e83e8c; /* Pink color */
    --color-red: #dc3545; /* Red color */
    --color-orange: #fd7e14; /* Orange color */
    --color-yellow: #ffc107; /* Yellow color */
    --color-green: #28a745; /* Green color */
    --color-teal: #20c997; /* Teal color */
    --color-grey: #6c757d; 
    
    --background-light: #f8f8f8;
    --background-dark: #343a40; 
    --text-light: #ffffff; 
    --text-dark: #333333; 
    --primary-color: var(--color-blue);
    --primary-color-dark: #0056b3; 
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'YourChosenFont', sans-serif; /* Replace with your chosen font */
    background-color: var(--background-light); /* Light background for light mode */
    color: var(--text-dark); /* Dark text color */
    line-height: 1.6;
    font-size: 16px; /* Base font size */
    overflow-x: hidden; /* Prevent horizontal scrolling */
  }

  /* Dark Mode Styles */
  body.dark-mode {
    background-color: var(--background-dark); /* Dark background */
    color: var(--text-light); /* Light text color */
  }

  a {
    text-decoration: none;
    color: inherit; /* Inherit color from parent */
    transition: color 0.3s;

    &:hover {
      color: var(--color-blue); /* Hover color */
    }
  }

  button {
    cursor: pointer;
    font: inherit;
    border: none;
    outline: none;
    transition: background-color 0.3s;

    &:focus {
      outline: 2px solid var(--color-blue);
    }
  }
`;

export default GlobalStyles;
