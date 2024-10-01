import React, { createContext, ReactNode, useReducer } from "react";

type User = {
  uid: string;
  fullName: string;
  email: string | null;
  photoUrl: string | null;
};

type UserState = {
  user: User | null;
};

const intialUserState: UserState = {
  user: null,
};
type UserAction = {
  type: "SET_USER" | "LOGOUT";
  payload: User | null;
};

export type UserContextType = {
  handleCreateAction: (user: User) => void;
};

export const UserContext = createContext<UserContextType | null>(null);

const userReducer = (state: UserState, action: UserAction) => {
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
    default:
      throw new Error("Invalid action type");
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, disptach] = useReducer(userReducer, intialUserState);

  function handleCreateAction(user: User) {
    disptach({
      type: "SET_USER",
      payload: {
        uid: user.uid,
        fullName: user.fullName,
        email: user.email,
        photoUrl: user.photoUrl,
      },
    });
  }

  return (
    <UserContext.Provider value={{ handleCreateAction }}>
      {children}
    </UserContext.Provider>
  );
};
