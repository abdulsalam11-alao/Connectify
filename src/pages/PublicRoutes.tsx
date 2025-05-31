import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    // User is logged in — redirect to /app/chat
    return <Navigate to="/app/chat" replace />;
  }

  // User NOT logged in — render children (the public page)
  return <>{children}</>;
}
