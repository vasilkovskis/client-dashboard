// ========== INITIALIZE ADMIN ==========
(function initAdmin() {
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  if (!users.some(u => u.role === 'admin')) {
    users.push({
      id: Date.now(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
})();

// ========== LOGIN ==========
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value.trim();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        document.getElementById('errorMsg').style.display = 'block';
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value.trim();

      let users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        document.getElementById('regMsg').textContent = "User already exists.";
        document.getElementById('regMsg').style.display = 'block';
        return;
      }

      users.push({ id: Date.now(), name, email, password, role: 'client' });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registered! You can now login.');
      window.location.href = 'index.html';
    });
  }
});

// ========== CHECK LOGIN ==========
function checkLogin() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
  }
}

// ========== CHECK ADMIN ==========
function checkAdmin() {
  checkLogin();
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  if (user.role !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'dashboard.html';
  } else {
    loadUsers();
  }
}

// ========== LOGOUT ==========
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

// ========== PROFILE ==========
function loadProfile() {
  checkLogin();
  const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  const container = document.getElementById('profileDetails');
  container.innerHTML = `
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Role:</strong> ${user.role}</p>
  `;
}

// ========== USER ADMIN PANEL ==========
function loadUsers() {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  tbody.innerHTML = '';
  users.forEach(user => {
    tbody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span class="badge bg-${user.role === 'admin' ? 'danger' : 'secondary'}">${user.role}</span></td>
        <td><button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button></td>
      </tr>
    `;
  });
}

function deleteUser(id) {
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  users = users.filter(u => u.id !== id);
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
}

const userForm = document.getElementById('userForm');
if (userForm) {
  userForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim().toLowerCase();
    const password = document.getElementById('userPassword').value.trim();
    const role = document.getElementById('userRole').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('Email already exists!');
      return;
    }

    users.push({ id: Date.now(), name, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    userForm.reset();
    loadUsers();
  });
}
