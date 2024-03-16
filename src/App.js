import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import About from './pages/About';
import './components/GlowBtnNav.css';

function App() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <Navbar expand='lg' className='fixed-top bg-body-tertiary shadow navbar-custom'>
        <Container>
          <Navbar.Brand>
            <Link to='/' className='navbar-brand fw-semibold text-light'>
              React restaurant
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto justify-center-end w-100'>
              <Nav.Link as={Link} to='/' className={`glow-on-hover ${isActive('/') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Home</Nav.Link>
              <Nav.Link as={Link} to='/menu' className={`glow-on-hover ${isActive('/menu') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Menu</Nav.Link>
              <Nav.Link as={Link} to='/about' className={`glow-on-hover ${isActive('/about') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>About</Nav.Link>
              <Nav.Link as={Link} to='/contact' className={`glow-on-hover ${isActive('/contact') ? 'glow-active' : ''} text-uppercase text-light mx-3`}>Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>

      <footer className='bg-body-tertiary'>
        <p className='p-3 m-0 text-center'>copyright @ made by Patrik</p>
      </footer>
    </div>
  );
}

export default App;
