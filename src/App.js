import React from 'react';
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
import './styles/GlowBtnNav.css';
import { UserProvider, useUser } from './context/UserContext';

function CustomNavbar() {
  const { user, logout } = useUser();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <Navbar expand='lg' className='fixed-top bg-body-tertiary shadow navbar-custom'>
      <Container>
        <Navbar.Brand>
          <Link to='/' className='navbar-brand fw-semibold text-light'>
            React Restaurant
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto justify-center-end w-100'>
            <Nav.Link as={Link} to='/' className={`glow-on-hover ${isActive('/') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Home</Nav.Link>
            <Nav.Link as={Link} to='/menu' className={`glow-on-hover ${isActive('/menu') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Menu</Nav.Link>
            <Nav.Link as={Link} to='/about' className={`glow-on-hover ${isActive('/about') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>About</Nav.Link>
            <Nav.Link as={Link} to='/contact' className={`glow-on-hover ${isActive('/contact') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Contact</Nav.Link>
            {user ? (
              <Nav.Link onClick={handleLogout} className="glow-on-hover text-uppercase text-light mx-3">
                {user.isAdmin === 1 ? 'Logout Admin' : 'Logout'}
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to='/login' className="glow-on-hover text-uppercase text-light mx-3">Login</Nav.Link>
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
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>

        <footer className='bg-body-tertiary'>
          <p className='p-3 m-0 text-center'>Copyright © Made by Patrik</p>
        </footer>
      </div>
    </UserProvider>
  );
}

export default App;
