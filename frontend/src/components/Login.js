import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success("Login Successfull");
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong");
    }
  };

  return (
  <div
    className="login-container d-flex justify-content-center align-items-center vh-100"
    style={{
      backgroundImage:
        "linear-gradient(rgba(78,115,223,0.85), rgba(28,200,138,0.85)), url('https://source.unsplash.com/1600x900/?finance,technology')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <form
      className="login-form rounded-4 shadow-lg bg-white p-5"
      style={{ maxWidth: "400px", width: "100%" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center mb-4 login-title fw-bold text-primary">
        <i className="fas fa-user me-2"></i>Login
      </h1>

      <div className="mb-3 form-group">
        <label className="form-label d-block text-start fw-semibold">
          <i className="fa-solid fa-envelope me-2"></i>Email
        </label>
        <input
          type="email"
          name="email"
          className="form-control rounded-3 input-field"
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-3 form-group">
        <label className="form-label d-block text-start fw-semibold">
          <i className="fas fa-lock me-2"></i>Password
        </label>
        <input
          type="password"
          name="password"
          className="form-control rounded-3 input-field"
          onChange={handleChange}
          required
          placeholder="Enter password"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100 login-btn rounded-3 fw-semibold"
      >
        Login
      </button>
      <ToastContainer />
    </form>
  </div>
);


};

export default Login;
