const API_URL = 'http://localhost:5000/api/users';

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  
  document.getElementById('addUserForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addUser();
  });
});

async function loadUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const users = await response.json();
    displayUsers(users);
  } catch (err) {
    document.getElementById('userTableContainer').innerHTML = 
      '<p>Error loading users: ' + err.message + '</p>';
  }
}

function displayUsers(users) {
  const container = document.getElementById('userTableContainer');
  
  if (users.length === 0) {
    container.innerHTML = '<p>No users yet</p>';
    return;
  }
  
  let html = '<table border="1">';
  html += '<thead><tr><th>ID</th><th>Username</th><th>Password</th><th>Actions</th></tr></thead>';
  html += '<tbody>';
  
  users.forEach(user => {
    html += `
      <tr id="row-${user.id}">
        <td>${user.id}</td>
        <td id="username-${user.id}">${user.username}</td>
        <td id="password-${user.id}">${user.password}</td>
        <td>
          <button onclick="editUsername(${user.id})">Edit Username</button>
          <button onclick="editPassword(${user.id})">Edit Password</button>
          <button onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

async function addUser() {
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    loadUsers();
  } catch (err) {
    alert('Error adding user: ' + err.message);
  }
}

async function editUsername(id) {
  const newUsername = prompt('Enter new username:');
  if (!newUsername) return;
  
  const passwordCell = document.getElementById(`password-${id}`);
  const currentPassword = passwordCell.textContent;
  
  await updateUser(id, newUsername, currentPassword);
}

async function editPassword(id) {
  const newPassword = prompt('Enter new password:');
  if (!newPassword) return;
  
  const usernameCell = document.getElementById(`username-${id}`);
  const currentUsername = usernameCell.textContent;
  
  await updateUser(id, currentUsername, newPassword);
}

async function updateUser(id, username, password) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    loadUsers();
  } catch (err) {
    alert('Error updating user: ' + err.message);
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    loadUsers();
  } catch (err) {
    alert('Error deleting user: ' + err.message);
  }
}
