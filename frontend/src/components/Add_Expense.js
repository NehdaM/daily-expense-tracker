import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Add_Expense = () => {
  const navigate = useNavigate();
  const [budgetList, setbudgetList] = useState({
    budget_item: '',
    budget_cost: '',
    budget_date: '',
  });

  const handleChange = (e) => {
    setbudgetList({ ...budgetList, [e.target.name]: e.target.value });
  };

  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/add_expense/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...budgetList, userId }),
      });
      if (response.status === 201) {
        toast.success('Expense added successfully');
        setTimeout(() => {
          navigate('/manage_expense');
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.log('Error: ', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" 
         style={{ background: "linear-gradient(135deg, #f9fafb, #eef2f7)" }}>
      <div
        className="card shadow-sm p-5 animate__animated animate__fadeInUp"
        style={{ 
          width: '100%', 
          maxWidth: '480px', 
          borderRadius: '1rem',
          background: "linear-gradient(145deg, #ffffff, #f1f5f9)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)"
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: "#0d6efd" }}>
            💰 Add Expense
          </h2>
          <p className="text-muted" style={{ fontSize: "0.95rem" }}>
            Record your expense and keep your budget on track
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold d-block text-start">Item Name :</label>
            <input 
              type="text" 
              name="budget_item" 
              className="form-control" 
              onChange={handleChange} 
              required 
              placeholder="Enter item name"
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold d-block text-start">Item Cost:</label>
            <input 
              type="number" 
              name="budget_cost" 
              className="form-control" 
              onChange={handleChange} 
              required 
              placeholder="Enter item cost"
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold d-block text-start">Purchased Date:</label>
            <input 
              type="date" 
              name="budget_date" 
              className="form-control" 
              onChange={handleChange} 
              required
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>
          <button 
            type="submit" 
            className="btn w-100 fw-bold"
            style={{
              background: "linear-gradient(135deg, #0d6efd, #3b82f6)",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              color: "#fff",
              transition: "all 0.3s ease"
            }}
          >
            ➕ Add Expense
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Add_Expense;
