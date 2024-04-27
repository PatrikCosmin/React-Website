import React, { useState, useRef, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import FeedbackManagement from './components/FeedbackManagement';
import UserManagement from './components/UserManagement'; // Import the UserManagement component
import Reservation from './components/Reservation'; // Adjust path as necessary
import './styles/GlowBtnNav.css';
import { UserProvider, useUser } from './context/UserContext';

function CustomNavbar() {
  const { user, logout } = useUser();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  const navbarRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const closeNavbar = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand='lg' className='fixed-top bg-body-tertiary shadow navbar-custom' expanded={expanded} ref={navbarRef}>
      <Container>
        <Navbar.Brand>
          <Link to='/' className='navbar-brand fw-semibold text-light'>
            React Restaurant
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto justify-center-end w-100'>
            <Nav.Link as={Link} to='/' onClick={closeNavbar} className={`glow-on-hover ${isActive('/') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Home</Nav.Link>
            <Nav.Link as={Link} to='/menu' onClick={closeNavbar} className={`glow-on-hover ${isActive('/menu') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Menu</Nav.Link>
            <Nav.Link as={Link} to='/reservation' onClick={closeNavbar} className={`glow-on-hover ${isActive('/menu') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Reservation</Nav.Link>
            <Nav.Link as={Link} to='/about' onClick={closeNavbar} className={`glow-on-hover ${isActive('/about') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>About</Nav.Link>
            <Nav.Link as={Link} to='/contact' onClick={closeNavbar} className={`glow-on-hover ${isActive('/contact') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Contact</Nav.Link>
            {user ? (
              <>
                {user.isAdmin === 1 && (
                  <>
                    <Nav.Link as={Link} to='/feedback' onClick={closeNavbar} className={`glow-on-hover ${isActive('/feedback') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Feedback</Nav.Link>
                    <Nav.Link as={Link} to='/users' onClick={closeNavbar} className={`glow-on-hover ${isActive('/users') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Users</Nav.Link> {/* Add link to UserManagement component */}
                  </>
                )}
                <Nav.Link onClick={handleLogout} className="glow-on-hover text-uppercase text-light mx-3">
                  {user.isAdmin === 1 ? 'Admin' : 'Logout'}
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to='/login' onClick={closeNavbar} className="glow-on-hover text-uppercase text-light mx-3">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <UserProvider>
      <div>
        <CustomNavbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/feedback' element={<FeedbackManagement />} />
          <Route path='/users' element={<UserManagement />} /> {/* Add route for UserManagement component */}
        </Routes>

        <footer className='bg-body-tertiary'>
          <p className='p-3 m-0 text-center'>Copyright © Made by Patrik</p>
        </footer>
      </div>
    </UserProvider>
  );
}

export default App;
