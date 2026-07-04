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
