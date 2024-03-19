import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../styles/Menu.css';

const baseURL = 'http://localhost:5000';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '' });
  const { user } = useUser();

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/menu`);
      setMenuItems(response.data);
      if (user && user.isAdmin !== 1) {
        console.error('Error: userData does not exist or user is not admin');
        // Handle error condition here
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [showModal]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setCurrentItem(null);
    setFormData({ name: '', description: '', price: '', image: '' });
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setCurrentItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await axios.put(`${baseURL}/api/menu/edit/${currentItem.id}`, formData);
      } else {
        await axios.post(`${baseURL}/api/menu/add`, formData);
      }
      setShowModal(false);
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

  return (
    <div className="menu-container">
      {user && user.isAdmin === 1 && (
        <Button onClick={openAddForm}>Add Product</Button>
      )}
      {menuItems.map(item => (
        <div className="menu-item glowing-border" key={item.id}>
          <img src={item.image} alt={item.name} className="menu-image" />
          <div className="menu-info">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            {user && user.isAdmin === 1 && (
              <>
                <Button onClick={() => openEditForm(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item.id)}>Delete</Button>
              </>
            )}
          </div>
        </div>
      ))}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentItem ? 'Edit Menu Item' : 'Add Menu Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Name" />
            <input type="text" name="description" value={formData.description} onChange={handleFormChange} placeholder="Description" />
            <input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="Price" />
            <input type="text" name="image" value={formData.image} onChange={handleFormChange} placeholder="Image URL" />
            <Button type="submit">{currentItem ? 'Update' : 'Add'}</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Menu;
