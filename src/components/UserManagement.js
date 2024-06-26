import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Users.css';
import '../styles/Navbar.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const addUser = async () => {
    try {
      const isAdminValue = isAdmin ? 1 : 0; // Convert isAdmin to 1 or 0 based on its value
      await axios.post('http://localhost:5000/api/user/add', { username, email, password, isAdmin: isAdminValue });
      fetchUsers();
      setUsername('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  

  return (
    
    <div className='users-container'>
      <h2>User Management</h2>
      <div className='users-form'>
        <h3>Add User</h3>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>
          Admin:
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        </label>
        <button className='glow-on-hover' onClick={addUser}>Add User</button>
      </div>
      <div>
        <ul>
          {users.map((user) => (
            <li className='users-item' key={user.id}>
              {user.username} - {user.email}
              <button className='glow-on-hover' onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
