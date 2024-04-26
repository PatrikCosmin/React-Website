import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Button from 'react-bootstrap/Button';
import '../styles/Menu.css';
import '../styles/FormBtn.css';

const baseURL = 'http://localhost:5000';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '', category: '', newCategory: '' });
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const { user } = useUser();

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/menu`);
      setMenuItems(response.data);
      const distinctCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(distinctCategories);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();

    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Expanding all categories for larger screens
        setCollapsedCategories({});
      }
    };

    // Adding the event listener on mount
    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setFormData({ name: '', description: '', price: '', image: '', category: '', newCategory: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = formData.category === 'new-category' ? { ...formData, category: formData.newCategory } : formData;

    try {
      await axios.post(`${baseURL}/api/menu/add`, submissionData);
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

  const toggleCollapse = (category) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
      <div className="menu-container">
        {categories.map(category => (
          <div className="category" key={category}>
            <h2>
              {category.charAt(0).toUpperCase() + category.slice(1)}{' '}
              <Button className='cool-btn' onClick={() => toggleCollapse(category)}>
                {collapsedCategories[category] ? "\\/" : "/\\"}
              </Button>
            </h2>
            {(!collapsedCategories[category] || window.innerWidth > 768) && menuItems.filter(item => item.category === category).map(item => (
              <div className="menu-item glowing-border" key={item.id}>
                <img src={item.image} alt={item.name} className="menu-image" />
                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>${item.price}</p>
                  {user && user.isAdmin === 1 && (
                    <Button className='login-btn' onClick={() => handleDelete(item.id)}>Delete</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {user && user.isAdmin === 1 && (
          <div className="admin-form-container">
            <h2>Add Menu Item</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" />
              <input type="text" name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" />
              <input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="Price" />
              <input type="text" name="image" value={formData.image} onChange={handleFormChange} placeholder="Image URL" />
              <select name="category" value={formData.category} onChange={handleFormChange}>
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="new-category">New Category</option>
              </select>
              {formData.category === 'new-category' && (
                <input
                  type="text"
                  name="newCategory"
                  value={formData.newCategory}
                  onChange={handleFormChange}
                  placeholder="New Category Name"
                />
              )}
              <Button className='login-btn' type="submit">Add</Button>
              <Button className='login-btn' onClick={clearForm}>Cancel</Button>
            </form>
          </div>
        )}
      </div>
  );
};

export default Menu;
