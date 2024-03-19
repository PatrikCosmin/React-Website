// src/pages/Menu.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Menu.css'; // Make sure you have this CSS file created for styling
import backgroundImg from '../utils/img/about-img.jpg'; // Adjust the path as needed


const baseURL = 'http://localhost:5000'; // Your backend base URL

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/menu`); // GET request to fetch menu items
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        // Optionally handle errors (e.g., show a message to the user)
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <div className="menu-container">
      {menuItems.map(item => (
        <div className="menu-item glowing-border" key={item.id}>
          <img src={item.image} alt={item.name} className="menu-image" />
          <div className="menu-info">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
