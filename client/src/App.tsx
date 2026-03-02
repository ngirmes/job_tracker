import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react"
import Login from "./pages/Login";
//import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
const[isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect( () => {
    async function verify() {
      const token = localStorage.getItem('token')
      if(!token) {
        return
      }
      const res = await fetch('http://localhost:3000/auth/me', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      
      if(res.ok) {
        setIsAuthenticated(true)
      }
      else{
        localStorage.removeItem('token')
      }
    }

    verify()
 }, [])

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Navigate to='login' /> } />
        <Route path="/login" element={ isAuthenticated ? <Navigate to='/dashboard' />: <Login />} />
        <Route path="/dashboard" element={ isAuthenticated ? <Dashboard />: <Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
