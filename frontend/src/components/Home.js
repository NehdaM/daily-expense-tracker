import React ,{ useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white"
         style={{ background: 'linear-gradient(135deg, #4e73df, #1cc88a)' }}>
      
      <h1 className="display-3 fw-bold mb-3">
        <i className="fas fa-home me-2"></i>Welcome to Expense Tracker
      </h1>

      <p className="lead mb-4" style={{ maxWidth: '600px' }}>
        Track your expenses, manage your budget, and stay on top of your finances — all in one place.
      </p>

      <div>
        <Link to='/login'>
        <button className="btn btn-light btn-lg me-3">
          <i className="fas fa-sign-in-alt me-2"></i>Login
        </button>
        </Link>
        <Link to='/signup'>
        <button className="btn btn-outline-light btn-lg">
          <i className="fas fa-user-plus me-2"></i>Signup
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
