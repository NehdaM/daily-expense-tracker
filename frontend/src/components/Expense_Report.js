import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


const Expense_Report = () => {
    const navigate = useNavigate();
      const [fromDate, setFromDate] = useState('');
      const [toDate, setToDate] = useState('');
      const [expenses, setExpense] = useState([])
      const [grandTotal, setGrandTotal] = useState(0)
    
      const userId = localStorage.getItem('userId');
      useEffect(() => {
        if (!userId) {
          navigate('/login');
        }
      }, [navigate]);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/search_expense/${userId}/?from=${fromDate}&to=${toDate}`)
          const data = await response.json();
          setExpense(data.expenses);
          setGrandTotal(data.total);

        }catch (error) {
          console.log('Error: ', error);
          toast.error('Something went wrong');
        }
      };
  return (
    <div>
            <div className="container mt-5">
              <div className="text-center mt-4" >
                <h2 className="text-center mb-4 text-primary">
                  📄 Expense Report
                </h2>
                <form className='row g-3' onSubmit={handleSubmit}>
                  <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-calendar"></i>
                        </span>
                        <input type="date" name="from_date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required placeholder="Enter item cost"/>
                    </div>
                  </div>

                  <div className="col-md-4 ">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-calendar"></i>
                        </span>
                        <input type="date" name="to_date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} required placeholder="Enter item cost"/>
                    </div>
                  </div>

                  <div className='col-md-4'>
                      <button type="submit" className="btn btn-primary w-100 h-30">
                        <i class="fa-solid fa-magnifying-glass"></i>
                         Search Expense
                      </button>
                  </div>
                </form>
                <table className="table table-bordered mt-4">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Item Name</th>
                      <th scope="col">Purchased Date</th>
                      <th scope="col">Item Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length > 0 ? ( 
                      expenses.map( (exp,index) => (
                          <tr key={exp.id}>
                              <th scope="row">{ index+1 }</th>
                              <td>{exp.budget_item}</td>
                              <td>{exp.budget_date}</td>
                              <td>{exp.budget_cost}</td>
                          </tr>
                      ))
                      ) : (
                      <>
                      <tr><td colSpan="5">No items</td></tr>
                      
                      </>
                      )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className='text-end fw-bold'>Grand Total 💸</td>
                      <td className='fw-bold'>{grandTotal}</td>
                    </tr>
                  </tfoot>
                </table>
                <ToastContainer />
              </div>
            </div>
    </div>
  )
}

export default Expense_Report