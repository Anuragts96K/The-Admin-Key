const express = require('express');
const router = express.Router();

const KEY = "Th1s!sTh3K3y!";
const SALT = "S4lt!sH3r3";

function encrypt(text) {
    let result = [];
    let combined = KEY + SALT;
    let pos = 3;
    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        let keyChar = combined.charCodeAt(i % combined.length);
        let encrypted = (charCode + keyChar + (i * pos)) % 256;
        result.push(encrypted.toString(16).padStart(2, '0'));
    }
    return result.join('');
}

function decrypt(hex) {
    let result = [];
    let combined = KEY + SALT;
    let pos = 3;
    for (let i = 0; i < hex.length; i += 2) {
        let encrypted = parseInt(hex.substr(i, 2), 16);
        let keyChar = combined.charCodeAt((i / 2) % combined.length);
        let decrypted = (encrypted - keyChar - ((i / 2) * pos)) % 256;
        if (decrypted < 0) decrypted += 256;
        result.push(String.fromCharCode(decrypted));
    }
    return result.join('');
}

const USERS = {
    'user': { password: 'Best@fluck', id: 'user' },
    'admin': { password: 'Th1s!sTh3P4ss!', id: 'admin' }
};

const sessions = {};

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }

    const user = USERS[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const encryptedId = encrypt(user.id);
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    sessions[token] = { username };

    res.json({
        message: 'Login successful',
        token: token,
        encrypted_user_id: encryptedId
    });
});

router.post('/profile/change-password', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    if (!sessions[token]) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session' });
    }

    const { userid, current_password, new_password } = req.body;

    if (!userid) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    let decryptedId;
    try {
        decryptedId = decrypt(userid);
    } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    if (decryptedId === 'user') {
        return res.json({
            success: false,
            message: 'Password will not be changed. Open your eyes and try to see the things that average people can\'t'
        });
    }

    if (decryptedId !== 'admin') {
        return res.json({
            success: false,
            message: 'You are close but use your brain'
        });
    }

    res.json({
        success: true,
        message: 'Congratulations! Here is your flag: FLAG{you_are_the_g.o.a.t}'
    });
});

module.exports = router;
