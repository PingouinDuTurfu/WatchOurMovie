const express = require('express');
const router = express.Router();
const Languages = require("../models/language");
router.post('/', async (req, res) => {
    try {
        const id = req.body.id;
        const language = await Languages.findOne({ id: id });

        if(language)
            res.status(200).json(language);
        else
            res.status(404).json({ error: 'Language not found' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const languages = await Languages.find().select('-_id -__v');
        res.status(200).json(languages);
    } catch (error) {
        res.status(500).json({error: 'An error occurred'});
    }
});

module.exports = router;