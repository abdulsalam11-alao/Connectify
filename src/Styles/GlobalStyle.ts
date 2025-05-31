import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  :root {
    --color-blue: #2563eb; /* Refined primary blue */
    --color-purple: #6d28d9; /* Vibrant purple */
    --color-pink: #ec4899; /* Modern pink */
    --color-red: #ef4444; /* Bold red */
    --color-orange: #f97316; /* Fresh orange */
    --color-yellow: #facc15; /* Bright yellow */
    --color-green: #10b981; /* Vibrant green */
    --color-teal: #14b8a6; /* Fresh teal */
    --color-grey: #6b7280; /* Neutral grey */
    
    --background-light: #f9fafb; /* Clean light background */
    --background-dark: #1e293b; /* Deep dark background */
    
    --text-light: #ffffff; /* Bright white text */
    --text-dark: #111827; /* Strong dark text */
    
    --primary-color: var(--color-blue);
    --primary-color-dark: #1d4ed8; /* Darker primary for hover states */
  }

  body.dark-mode {
    --color-blue: #3b82f6; /* Lighter blue for dark mode */
    --color-purple: #8b5cf6; /* Softer purple */
    --color-pink: #f472b6; /* Softer pink */
    --color-red: #f87171; /* Softer red */
    --color-orange: #fb923c; /* Softer orange */
    --color-yellow: #fde047; /* Softer yellow */
    --color-green: #34d399; /* Lighter green */
    --color-teal: #2dd4bf; /* Lighter teal */
    --color-grey: #9ca3af; /* Softer grey */

    --background-light: #1e293b;
    --background-dark: #0f172a;

    --text-light: #f9fafb;
    --text-dark: #e5e7eb;

    --primary-color: var(--color-blue);
    --primary-color-dark: #1e40af;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
  }

  body {
    background-color: var(--background-light);
    color: var(--text-dark);
    line-height: 1.6;
    font-size: 16px;
    overflow-x: hidden;
    font-family: 'Roboto', sans-serif;
  }

  body.dark-mode {
    background-color: var(--background-dark);
    color: var(--text-light);
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color);
    }
  }

  button {
    cursor: pointer;
    font: inherit;
    border: none;
    outline: none;
    transition: background-color 0.3s ease;

    &:focus {
      outline: 2px solid var(--primary-color);
    }
  }
`;

export default GlobalStyles;
