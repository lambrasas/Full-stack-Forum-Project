import "../components/RegisterPage.scss";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";
import React, { useState } from "react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.text();
      alert(data);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed");
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
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
