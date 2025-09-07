import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import API from './api';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchMe = async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data.authenticated) setUser(res.data.user);
      else setUser(null);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogout = async () => {
    await API.post('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header>
        <nav>
          <div className="logo">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/045/767/931/small_2x/leaf-letter-k-logo-icon-template-design-free-vector.jpg" alt="Logo" className="logo-img" />
            <span className="logo-text">Klickks</span>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            {!user && (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}
            {user && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </nav>
      </header>
<div className='content-container'>
      <main>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/register" element={<Register onAuth={setUser} />} />
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute user={user}>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
<img src="https://media.gettyimages.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.jpg?s=612x612&w=gi&k=20&c=BFc13n-vhT4GMd0ohRt0PFD3IzJ_Onf6nKDAObgh1CA=" alt="Background" className="background-image" />
     </div>
      <footer>
        <p>© {new Date().getFullYear()} Klickks App</p>
      </footer>
    </div>
  );
}

export default App;
