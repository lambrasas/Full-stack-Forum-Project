import "../components/RegisterPage.scss";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";

function RegisterPage() {
  const handleNameChange = (event) => {
    console.log(event.target.value);
  };
  const handleEmailChange = (event) => {
    console.log(event.target.value);
  };
  const handlePasswordChange = (event) => {
    console.log(event.target.value);
  };

  return (
    <main className="register-container">
      <section className="register-form">
        <header className="form-header">Register</header>
        <p>Register and join the conversation!</p>
        <form className="form-fields">
          <InputField label="Name" type="text" onChange={handleNameChange} />
          <InputField label="Email" type="email" onChange={handleEmailChange} />
          <InputField
            label="Password"
            type="password"
            onChange={handlePasswordChange}
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
