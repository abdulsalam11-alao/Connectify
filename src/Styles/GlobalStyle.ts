// GlobalStyles.tsx

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  :root {
    /* Light Mode Variables */
<<<<<<< HEAD
    --color-blue: #007bff; /* Primary blue color */
    --color-purple: #6f42c1; /* Purple color */
    --color-pink: #e83e8c; /* Pink color */
    --color-red: #dc3545; /* Red color */
    --color-orange: #fd7e14; /* Orange color */
    --color-yellow: #ffc107; /* Yellow color */
    --color-green: #28a745; /* Green color */
    --color-teal: #20c997; /* Teal color */
    --color-grey: #6c757d; 
    
    --background-light: #f8f8f8; /* Light background */
    --background-dark: #343a40; /* Dark background */
    
    --text-light: #ffffff; /* Light text color */
    --text-dark: #333333; /* Dark text color */
    
    --primary-color: var(--color-blue); /* Primary theme color */
    --primary-color-dark: #0056b3; /* Darker primary color for hover states */
=======
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
    
    --primary-color: var(--color-blue); /* Primary theme color */
    --primary-color-dark: #1d4ed8; /* Darker primary for hover states */
>>>>>>> d57bcc5 (Fix: ProtectRoute usage for public routes and improve redirection logic)
  }

  /* Dark Mode Variables */
  body.dark-mode {
<<<<<<< HEAD
    --color-blue: #66b3ff; /* Lighter blue for dark mode */
    --color-purple: #9b59b6; /* Lighter purple for dark mode */
    --color-pink: #ff6f61; /* Lighter pink for dark mode */
    --color-red: #ff4d4f; /* Lighter red for dark mode */
    --color-orange: #ff8c00; /* Lighter orange for dark mode */
    --color-yellow: #ffcc00; /* Lighter yellow for dark mode */
    --color-green: #4caf50; /* Lighter green for dark mode */
    --color-teal: #20c997; /* Teal color remains the same */
    --color-grey: #c7c7c7; /* Lighter grey for dark mode */

    --background-light: #343a40;
    --background-dark: #212529;
    
    --text-light: #ffffff; /* Ensure light text remains white in dark mode */
    --text-dark: #f8f9fa;  /* Light text color for other elements */

    --primary-color: var(--color-blue); 
    --primary-color-dark: #0056b3; 
=======
    --color-blue: #3b82f6; /* Lighter blue for dark mode */
    --color-purple: #8b5cf6; /* Softer purple */
    --color-pink: #f472b6; /* Softer pink */
    --color-red: #f87171; /* Softer red */
    --color-orange: #fb923c; /* Softer orange */
    --color-yellow: #fde047; /* Softer yellow */
    --color-green: #34d399; /* Lighter green */
    --color-teal: #2dd4bf; /* Lighter teal */
    --color-grey: #9ca3af; /* Softer grey */

    --background-light: #1e293b; /* For dark mode light backgrounds */
    --background-dark: #0f172a; /* Very dark background */
    
    --text-light: #f9fafb; /* Off-white for readability */
    --text-dark: #e5e7eb; /* Light grey for dark mode text */

    --primary-color: var(--color-blue); 
    --primary-color-dark: #1e40af; /* Darker for dark mode hover */
>>>>>>> d57bcc5 (Fix: ProtectRoute usage for public routes and improve redirection logic)
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
  }

  body {
    background-color: var(--background-light); /* Light mode background */
    color: var(--text-dark); /* Light mode text color */
    line-height: 1.6;
    font-size: 16px; /* Base font size */
    overflow-x: hidden; /* Prevent horizontal scroll */
    font-family: 'Roboto', sans-serif; /* Apply Roboto font */
  }

  /* Dark Mode Styles */
  body.dark-mode {
    background-color: var(--background-dark); 
    color: var(--text-light); /* Dark mode text color set to white */
  }

  a {
    text-decoration: none;
    color: inherit; 
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color); /* Hover color */
    }
  }

  button {
    cursor: pointer;
    font: inherit; /* Inherit font styles */
    border: none;
    outline: none;
    transition: background-color 0.3s ease;

    &:focus {
      outline: 2px solid var(--primary-color); /* Focus outline */
    }
  }
`;

export default GlobalStyles;
