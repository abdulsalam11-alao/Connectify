// src/styles/GlobalStyles.ts
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
    --color-grey: #6c757d; /* Greyscale color */
    
    --background-light: #f4f4f4; /* Light background for light mode */
    --background-dark: #343a40; /* Dark background for dark mode */
    --text-light: #ffffff; /* Light text color for dark mode */
    --text-dark: #333333; /* Dark text color for light mode */
    --primary-color: var(--color-blue); /* Primary color */
    --primary-color-dark: #0056b3; /* Darker shade of primary color for hover effects */
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

  /* Add styles for dark mode */
  body.dark-mode {
    background-color: var(--background-dark); /* Dark background */
    color: var(--text-light); /* Light text color */
  }

  a {
    text-decoration: none;
    color: inherit; /* Inherit color from parent */
    transition: color 0.3s; /* Smooth color transition */
    
    &:hover {
      color: var(--color-blue); /* Change color on hover */
    }
  }

  button {
    cursor: pointer;
    font: inherit; /* Ensure button font matches body font */
    border: none; /* Remove default border */
    outline: none; /* Remove outline */
    transition: background-color 0.3s; /* Smooth background color transition */
    
    &:focus {
      outline: 2px solid var(--color-blue); /* Accessibility focus outline */
    }
  }
`;

export default GlobalStyles;
