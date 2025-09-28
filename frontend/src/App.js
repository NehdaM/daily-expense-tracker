import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import "./App.css";
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Add_Expense from './components/Add_Expense';
import Manage_Expense from './components/Manage_Expense';
import Expense_Report from './components/Expense_Report';
import Change_Password from './components/Change_Password';
import Profile from './components/Profile';

function App() {
  const userId = localStorage.getItem('userId')
  return (
    <div className="App">
      <div className="App">
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={userId ? <Navigate to="/dashboard"/> : <Home/> }></Route>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/add_expense" element={<Add_Expense/>}></Route>
            <Route path="/manage_expense" element={<Manage_Expense/>}></Route>
            <Route path="/expense_report" element={<Expense_Report/>}></Route>
            <Route path="/change_password" element={<Change_Password/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
