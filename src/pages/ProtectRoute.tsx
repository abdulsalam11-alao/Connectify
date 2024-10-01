import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

export default function ProtectRoute({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const userToken = localStorage.getItem("userToken");

  console.log(location.pathname);
  useEffect(
    function () {
      if (!userToken) {
        navigate("/login");
      } else if (userToken && location.pathname === "/login") {
        navigate("/app/chat");
      }
    },
    [userToken, navigate, location.pathname]
  );
  return userToken ? children : null;
}
