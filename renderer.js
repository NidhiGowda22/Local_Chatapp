const socket = io('http://localhost:3000');

window.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const chatForm = document.getElementById('chatForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('User registered');
                window.location.href = 'login.html';
            } else {
                alert('Error registering user');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Login successful');
                window.location.href = 'chat.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const room = document.getElementById('room').value;
            const message = document.getElementById('message').value;
            socket.emit('chatMessage', { room, message });
            document.getElementById('message').value = '';
        });
    }

    socket.on('message', (message) => {
        const messageList = document.getElementById('messages');
        const messageItem = document.createElement('li');
        messageItem.textContent = message;
        messageList.appendChild(messageItem);
    });
});
