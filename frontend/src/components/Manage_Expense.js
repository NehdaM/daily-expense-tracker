import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Manage_Expense = () => {
  const navigate = useNavigate();
  const [expense, setExpense] = useState([]);
  const [editExpense, setEditexpense] = useState(null);

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    fetchExpenses(userId);
  }, []);

  const handleEdit = (expense) => {
    setEditexpense(expense);
  };

  const handleChange = (e) => {
    setEditexpense({ ...editExpense, [e.target.name]: e.target.value });
  };

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/manage_expense/${userId}`
      );
      const data = await response.json();
      setExpense(data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update_expense/${editExpense.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editExpense),
        }
      );
      if (response.status === 200) {
        toast.success("Expense edited successfully!");
        setEditexpense(null);
        fetchExpenses(userId);
      } else {
        toast.error("Updating failed!");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/delete_expense/${expenseId}/`,
          {
            method: "DELETE",
          }
        );
        if (response.status === 200) {
          toast.success("Expense deleted successfully!");
          fetchExpenses(userId);
        } else {
          toast.error("Delete failed!");
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="container py-5">
      {/* Heading */}
      <h1 className="text-center mb-4 fw-bold text-primary">
        📊 Manage Your Expenses
      </h1>

      {/* Expense Table */}
      <div className="table-responsive table-bordered shadow rounded">
        <table className="table align-middle table-hover">
          <thead
            className="text-white"
            style={{
              background: "linear-gradient(90deg, #4facfe, #00f2fe)",
            }}
          >
            <tr>
              <th scope="col">#</th>
              <th scope="col">Item Name</th>
              <th scope="col">Item Cost</th>
              <th scope="col">Purchased Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {expense.length > 0 ? (
              expense.map((exp, index) => (
                <tr key={exp.id}>
                  <th scope="row">{index + 1}</th>
                  <td className="fw-semibold">{exp.budget_item}</td>
                  <td className="text-success fw-bold">₹{exp.budget_cost}</td>
                  <td>
                    <span className="fw-semibold text-dark">
                      {exp.budget_date}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleEdit(exp)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No expenses added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editExpense && (
        <div className="modal show d-block" id="exampleModal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div
                className="modal-header text-white"
                style={{ background: "linear-gradient(90deg, #4facfe, #00f2fe)" }}
              >
                <h5 className="modal-title">
                  <i className="fas fa-pen me-2"></i> Edit Expense
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditexpense(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    name="budget_item"
                    className="form-control"
                    value={editExpense.budget_item}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Item Cost</label>
                  <input
                    type="number"
                    name="budget_cost"
                    className="form-control"
                    value={editExpense.budget_cost}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purchased Date</label>
                  <input
                    type="date"
                    name="budget_date"
                    className="form-control"
                    value={editExpense.budget_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditexpense(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Manage_Expense;
