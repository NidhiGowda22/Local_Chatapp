// renderer.js
const { ipcRenderer } = require('electron');

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  ipcRenderer.send('login', { username, password });
}

function sendMessage() {
  const message = document.getElementById('message').value;
  ipcRenderer.send('send-message', { message });
}

ipcRenderer.on('login-success', (event, token) => {
  // Handle successful login, display chat interface
  document.getElementById('login').style.display = 'none';
  document.getElementById('chat').style.display = 'block';
});

ipcRenderer.on('message-received', (event, messages) => {
  // Display messages in chat interface
});
