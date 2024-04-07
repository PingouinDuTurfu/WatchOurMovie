const express = require('express');
const router = express.Router();
const Log = require('../models/log');

router.post('/add', async (req, res) => {
    try {
        const { userId, data } = req.body;

        const log = new Log({
            userId: userId,
            message: data
        });

        await log.save();
        res.status(200).json(log);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
        res.status(200).json(logs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
