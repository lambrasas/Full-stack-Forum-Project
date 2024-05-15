import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
import "./LogoutButton.scss";

const LogoutButton = () => {
  const { logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
