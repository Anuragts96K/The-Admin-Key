const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.use('/api', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`CTF Challenge running on http://localhost:${PORT}`);
});
