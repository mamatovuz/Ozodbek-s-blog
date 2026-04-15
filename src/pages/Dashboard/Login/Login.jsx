import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  isAuthenticated,
  setAuthenticated,
} from "../../../utils/blogStore";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      formData.email.trim() === ADMIN_EMAIL &&
      formData.password === ADMIN_PASSWORD
    ) {
      setAuthenticated(true);
      setError("");
      navigate("/dashboard", { replace: true });
      return;
    }

    setError("Email yoki parol noto'g'ri.");
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <p className="login-kicker">Dashboard access</p>
        <h1>Admin panelga kirish</h1>
        <p className="login-copy">
          To'g'ri login qilingandan keyingina dashboard sahifasi ochiladi.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Emailni kiriting"
              required
            />
          </label>

          <label>
            Parol
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Parolni kiriting"
              required
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="login-button">
            Kirish
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
