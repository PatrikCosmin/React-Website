import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Button from 'react-bootstrap/Button';
import '../styles/Menu.css';
import '../styles/FormBtn.css';

const baseURL = 'http://localhost:5000';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '', category: '' });
  const { user } = useUser();

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/menu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEditForm = (item) => {
    setCurrentItem(item);
    setFormData(item);
  };

  const clearForm = () => {
    setFormData({ name: '', description: '', price: '', image: '', category: '' });
    setCurrentItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await axios.put(`${baseURL}/api/menu/edit/${currentItem.id}`, formData);
      } else {
        await axios.post(`${baseURL}/api/menu/add`, formData);
      }
      clearForm();
      fetchMenuItems(); // Fetch menu items again to reflect the changes
    } catch (error) {
      console.error('Error submitting menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/menu/delete/${id}`);
      fetchMenuItems(); // Fetch menu items again after deletion
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const filterItemsByCategory = (category) => {
    return menuItems.filter(item => item.category === category);
  };

  return (
    <div className="menu-container">
      <div className="category">
        <h2>Appetizers</h2>
        {filterItemsByCategory('appetizer').map(item => (
          <div className="menu-item glowing-border" key={item.id}>
            <img src={item.image} alt={item.name} className="menu-image" />
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              {user && user.isAdmin === 1 && (
                <>
                  <Button className='login-btn' onClick={() => openEditForm(item)}>Edit</Button>
                  <Button className='login-btn' onClick={() => handleDelete(item.id)}>Delete</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Repeat similar sections for other categories (main dishes, desserts) */}
      <div className="category">
        <h2>Main Dishes</h2>
        {filterItemsByCategory('main').map(item => (
          <div className="menu-item glowing-border" key={item.id}>
            <img src={item.image} alt={item.name} className="menu-image" />
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              {user && user.isAdmin === 1 && (
                <>
                  <Button className='login-btn' onClick={() => openEditForm(item)}>Edit</Button>
                  <Button className='login-btn' onClick={() => handleDelete(item.id)}>Delete</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="category">
        <h2>Desserts</h2>
        {filterItemsByCategory('dessert').map(item => (
          <div className="menu-item glowing-border" key={item.id}>
            <img src={item.image} alt={item.name} className="menu-image" />
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              {user && user.isAdmin === 1 && (
                <>
                  <Button className='login-btn' onClick={() => openEditForm(item)}>Edit</Button>
                  <Button className='login-btn' onClick={() => handleDelete(item.id)}>Delete</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {user && user.isAdmin === 1 && (
        <div className="admin-form-container menu-item">
          <h2>{currentItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" />
            <input type="text" name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" />
            <input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="Price" />
            <input type="text" name="image" value={formData.image} onChange={handleFormChange} placeholder="Image URL" />
            <select name="category" value={formData.category} onChange={handleFormChange}>
              <option value="">Select category</option>
              <option value="appetizer">Appetizer</option>
              <option value="main">Main Dish</option>
              <option value="dessert">Dessert</option>
            </select>
            <Button className='login-btn' type="submit">{currentItem ? 'Update' : 'Add'}</Button>
            <Button className='login-btn' onClick={clearForm}>Cancel</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Menu;
