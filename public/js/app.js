document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errEl = document.getElementById('login-error');

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('encrypted_user_id', data.encrypted_user_id);
                localStorage.setItem('username', username);
                window.location.href = '/dashboard.html';
            } else {
                errEl.textContent = data.message || 'Login failed';
            }
        });
    }

    if (document.getElementById('display-encrypted')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
    }

    const changeForm = document.getElementById('changePasswordForm');
    if (changeForm) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        changeForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const encryptedUserId = localStorage.getItem('encrypted_user_id');
            const resultEl = document.getElementById('result');

            if (newPassword !== confirmPassword) {
                resultEl.className = 'result-box error';
                resultEl.textContent = 'New passwords do not match';
                return;
            }

            const encryptedCurrent = encrypt(currentPassword);
            const encryptedNew = encrypt(newPassword);

            const res = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    current_password: encryptedCurrent,
                    new_password: encryptedNew,
                    userid: encryptedUserId
                })
            });

            const data = await res.json();
            resultEl.className = 'result-box ' + (data.success ? 'success' : 'error');
            resultEl.textContent = data.message;
        });
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/login.html';
        });
    }

});
