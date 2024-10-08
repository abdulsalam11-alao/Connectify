import { DocumentReference, Timestamp } from "firebase/firestore";
import React, { createContext, ReactNode, useReducer } from "react";

// Define the User type
export type User = {
  uid: string;
  fullName: string;
  email: string | null;
  photoUrl: string | null;
};

export type UserWithRef = User & {
  ref: DocumentReference;
  lastMessage: string;
  lastMessageTime: Timestamp;
  lastRead?: Timestamp;
};

type OtherUsers = UserWithRef[];

// Define the UserState interface
type UserState = {
  user: User | null;
  otherUsers: OtherUsers;
};

// Initial state
const initialUserState: UserState = {
  user: null,
  otherUsers: [],
};

// Define the UserAction type using discriminated unions
type UserAction =
  | { type: "SET_USER"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_OTHER_USERS"; payload: OtherUsers };

// Define the context type
export type UserContextType = {
  setUser: (user: User) => void;
  logout: () => void;
  setOtherUsers: (users: OtherUsers) => void;
  state: UserState;
};

// Create the UserContext
export const UserContext = createContext<UserContextType | null>(null);

// Reducer function
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "SET_OTHER_USERS":
      return {
        ...state,
        otherUsers: action.payload,
      };
    default:
      throw new Error("Invalid action type");
  }
};

// UserProvider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  // Function to set the current user
  const setUser = (user: User) => {
    dispatch({
      type: "SET_USER",
      payload: user,
    });
  };

  // Function to logout the user
  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  // Function to set other users
  const setOtherUsers = (users: OtherUsers) => {
    dispatch({
      type: "SET_OTHER_USERS",
      payload: users,
    });
  };

  return (
    <UserContext.Provider value={{ setUser, logout, setOtherUsers, state }}>
      {children}
    </UserContext.Provider>
  );
};
