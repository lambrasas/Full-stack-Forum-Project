import "../components/RegisterPage.scss";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (inputEmail) => {
    if (!/\S+@\S+\.\S+/.test(inputEmail)) {
      setEmailError("Invalid email format, e.g., my@email.com");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (inputPassword) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(inputPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        navigate("/");
      } else {
        const errorMsg = await response.text();
        setGeneralError(errorMsg);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setGeneralError("Failed to register due to server error.");
    }
  };

  return (
    <main className="register-container">
      <section className="register-form">
        <header className="form-header">Register</header>
        <p>Register and join the conversation!</p>
        <form className="form-fields" onSubmit={handleSubmit}>
          <InputField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div style={{ color: "red" }}>{emailError}</div>}
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div style={{ color: "red" }}>{passwordError}</div>}
          {generalError && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {generalError}
            </div>
          )}
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <footer className="form-footer">
          Have an account?{" "}
          <Link className="login-link" to="/">
            Login!
          </Link>
        </footer>
      </section>
    </main>
  );
}

export default RegisterPage;
