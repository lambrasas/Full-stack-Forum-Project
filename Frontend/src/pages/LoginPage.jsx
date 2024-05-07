import React, { useState } from "react";
import InputField from "../components/InputField";
import { useUser } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../components/LoginPage.scss";
function LoginForm() {
  const { loginUser } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const success = await loginUser(email, password);
      if (success) {
        navigate("/threads");
      } else {
        setError("Incorrect credentials, please try again.");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed due to server error.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button type="submit" className="login-button">
        Login
      </button>
    </form>
  );
}
function LoginPage() {
  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Login</h1>
          <p className="login-description">
            You can login with your registered account.
          </p>

          <LoginForm />
          <p className="create-account-text">
            Don't have an account ? <span></span>
            <Link to="/register" className="create-account-link">
              Create one!
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
