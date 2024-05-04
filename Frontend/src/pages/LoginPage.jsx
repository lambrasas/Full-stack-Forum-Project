import * as React from "react";
import "../components/LoginPage.scss";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useState } from "react";
import { useUser } from "../Contexts/UserContext";
function LoginForm() {
  const { loginUser } = useUser();
  const { user } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const success = await loginUser(email, password);
      if (success) {
        navigate("/threads");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed due to server error.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
