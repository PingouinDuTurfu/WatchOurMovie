import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AppDeconnexion() {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken === null) {
      navigate("/");
    }
  }, [authToken]);
  return <></>;
}
