import * as React from "react";
import "../components/LoginPage.scss";
import { Link } from "react-router-dom";
import RegisterPage from "./RegisterPage";
function LoginForm() {
  return (
    <form className="login-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="form-input"
          placeholder="yayan@durian.cc"
        />
      </div>
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="password" className="form-label">
            Password
          </label>
        </div>
        <input
          type="password"
          id="password"
          className="form-input"
          placeholder="••••••••••••••••••••••"
        />
      </div>
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
