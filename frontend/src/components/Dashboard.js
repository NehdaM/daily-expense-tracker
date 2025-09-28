import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import './Dashboard.css';

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState();
  const [expense, setExpense] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [last7DTotal, setLast7DTotal] = useState(0);
  const [last30DTotal, setlast30DTotal] = useState(0);
  const [currentYearTotal, setcurrentYearTotal] = useState(0);
  const [grandTotal, setgrandTotal] = useState(0);
  const [chartLoaded, setChartLoaded] = useState(false); // For fade-in effect

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    setUserName(userName);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) navigate('/login');
    fetchExpenses(userId);
  }, []);

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}`);
      const data = await response.json();
      setExpense(data);
      calculateSum(data);
      setChartLoaded(true);
    } catch (error) {
      console.log("Error fetching the expenses", error);
    }
  }; 

  const calculateSum = (data) => {
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date(); last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date(); last30Days.setDate(today.getDate() - 30);
    const currentYear = today.getFullYear();

    let todaySum = 0, yesterdaySum = 0, last7Sum = 0, last30Sum = 0, yearSum = 0, grandSum = 0;

    data.forEach(item => {
      const budget = new Date(item.budget_date);
      const cost = parseFloat(item.budget_cost) || 0;

      if (budget.toDateString() === today.toDateString()) todaySum += cost;
      if (budget.toDateString() === yesterday.toDateString()) yesterdaySum += cost;
      if (budget >= last7Days) last7Sum += cost;
      if (budget >= last30Days) last30Sum += cost;
      if (budget.getFullYear() === currentYear) yearSum += cost;

      grandSum += cost;
    });

    setTodayTotal(todaySum);
    setYesterdayTotal(yesterdaySum);
    setLast7DTotal(last7Sum);
    setlast30DTotal(last30Sum);
    setcurrentYearTotal(yearSum);
    setgrandTotal(grandSum);
  };

  const pieData = {
    labels: expense.map(item => item.budget_item),
    datasets: [
      {
        label: '₹',
        data: expense.map(item => parseFloat(item.budget_cost)),
        backgroundColor: [
          "#FF6B6B", "#4ECDC4", "#45B7D1",
          "#96CEB4", "#FFEAA7", "#FF9F1C", "#2EC4B6"
        ],
        borderWidth: 1,
      }
    ]
  };

  const pieOptions = {
    animation: { animateScale: false, animateRotate: false },
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 15, padding: 15, color: "#333", font: { size: 12} }
      }
    },
    layout: { padding: 10 },
    maintainAspectRatio: false
  };

  return (
    <div className="min-vh-100 bg-slate-50 px-4 py-8">
      <div className="dashboard-header text-center mb-12">
        <h1 className="dashboard-title">
          Welcome <span className="highlight">{userName}</span>
        </h1>
        <p className="dashboard-subtitle">
          Your personal space to track, analyze, and control your expenses.
        </p>
      </div>

      <div className="row g-4 mb-8 text-center">
        {[
          {
            title: "Smart Expense Tracking",
            icon: "fas fa-chart-pie",
            description: "Track your daily, weekly, and monthly expenses efficiently with Express Tracker.",
            color: "#FF6B6B"
          },
          {
            title: "Visualize Financial Patterns",
            icon: "fas fa-chart-line",
            description: "Interactive charts help you understand your spending habits and make informed decisions.",
            color: "#00B894"
          },
          {
            title: "Manage Your Budget",
            icon: "fas fa-wallet",
            description: "Categorize your expenses, plan your budget, and gain control over your finances.",
            color: "#D2B48C"
          }
        ].map((card, index) => (
          <div key={index} className="col-md-4 ">
            <div
              className="card h-100 shadow-sm p-4 hover:shadow-lg transition-shadow duration-300"
              style={{
                borderRadius: "1rem",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                opacity: 0,
                animation: `fadeInUp 0.8s forwards ${index * 0.2}s`
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className={`${card.icon} fa-2x mb-3 text-blue-400`} style={{color: card.color}}></i>
                <h5 className="card-title mb-2">{card.title}</h5>
                <p className="card-text">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-8 mt-4">
        
        <div className="col-lg-6">
          <div className="row g-4">
            {[ 
              { title: "Today's Expense", value: todayTotal },
              { title: "Yesterday's Expense", value: yesterdayTotal },
              { title: "Last 7 Days", value: last7DTotal },
              { title: "Last 30 Days", value: last30DTotal }
            ].map((card, index) => (
              <div key={index} className="col-md-6">
                <div className="card h-100 text-center shadow-sm p-4 hover:shadow-lg transition-all duration-300" style={{ borderRadius: "1rem", height: "150px" }}>
                  <div className="card-body d-flex flex-column justify-content-center">
                    <h5 className="card-title">
                      <i className="fas fa-calendar me-2"></i> {card.title}
                      
                    </h5>
                    <p className="amount-text">₹{card.value}</p>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-6 d-flex">
          <div className="card flex-fill shadow-sm text-center p-4" style={{ borderRadius: "1rem", height: "340px" }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <h4 className="mb-3">Expense Distribution</h4>
              <div style={{ flex: 1, minHeight: 0, opacity: chartLoaded ? 1 : 0, transition: "opacity 0.8s ease-in" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        {[ 
          { title: "Last Year Expense", value: currentYearTotal, style: "#204946ff" },
          { title: "Overall Expense", value: grandTotal, style: "#82f6eeff" }
        ].map((card, index) => (
          <div key={index} className="col-md-6">
            <div className="card h-100 text-center shadow-sm p-4 hover:shadow-lg transition-all duration-300" style={{ borderRadius: "1rem", height: "150px" }}>
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title mb-2">
                  <i className="fas fa-calendar fa-2x mb-2" style={{ color: card.style }}></i> {card.title}
                  
                </h5>
                <p className="card-text fs-4">₹{card.value}</p>
              </div>
            </div>
          </div>
        ))}

      </div>

      <div className="row g-4 mt-4 mb-3 text-center">
        {[
          {
            title: "Stay Financially Healthy",
            icon: "fas fa-heartbeat",
            description: "Keep your finances in check and reduce unnecessary spending by tracking every expense."
          },
          {
            title: "Data-driven Decisions",
            icon: "fas fa-lightbulb",
            description: "Use insights and visualizations to make smarter budgeting and spending choices."
          },
          {
            title: "Secure & Reliable",
            icon: "fas fa-shield-alt",
            description: "Your expense data is private and safely stored while you track and plan your budget."
          }
        ].map((card, index) => (
          <div key={index} className="col-md-4">
            <div 
              className="card h-100 shadow-sm p-4 hover:shadow-lg transition-shadow duration-300"
              style={{
                borderRadius: "1rem",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                opacity: 0,
                animation: `fadeInUp 0.8s forwards ${index * 0.2}s`
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className={`${card.icon} fa-2x mb-3`} style={{ color: index === 0 ? "#FF6B6B" : index === 1 ? "#4ECDC4" : "#FFA500" }}></i>
                <h5 className="card-title mb-2">{card.title}</h5>
                <p className="card-text">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>

  );
};

export default Dashboard;