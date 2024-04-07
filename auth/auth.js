const express = require('express');
const router = express.Router();
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '';

if(!JWT_SECRET) {
    console.error('JWT_SECRET not set');
    process.exit(1);
}

router.post('/register', async (req, res) => {
    try {
        const { username, hashPassword } = req.body;

        const alreadyUser = await User.findOne({ username: username });

        if(alreadyUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }


        const user = new User({ username, password: hashPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, hashPassword } = req.body;

        console.log(username, hashPassword);

        const user = await User.findOne({ username });
        if (!user)
            return res.status(401).json({ error: 'Authentication failed' });

        const passwordMatch = user.password === hashPassword;

        if (!passwordMatch)
            return res.status(401).json({ error: 'Authentication failed' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {expiresIn: '1h',});

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;