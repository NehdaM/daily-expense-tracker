import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark shadow-sm"
        style={{
          background: "linear-gradient(90deg, #1e3c72, #2a5298)", // Gradient
          padding: "0.8rem 1.5rem", // More height
          fontSize: "1.05rem", // Slightly bigger text
        }}
      >
        <Link className="navbar-brand fw-bold text-white fs-4" to="/">
          💸 Expense Tracker
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav align-items-center">
            {userId ? (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/dashboard">
                    <i className="fas fa-home me-1"></i>Home
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/add_expense">
                    <i className="fas fa-plus me-1"></i>Add Expense
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/manage_expense">
                    <i className="fas fa-shopping-cart me-1"></i>Manage Expense
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/expense_report">
                    <i className="fa-sharp fa-solid fa-file me-1"></i>Expense Report
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/profile">
                    <i className="fa-solid fa-person me-1"></i>Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-danger px-3 py-1 fw-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/">
                    <i className="fas fa-home me-1"></i>Home
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-user me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link" to="/signup">
                    <i className="fas fa-user-plus me-1"></i>Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
