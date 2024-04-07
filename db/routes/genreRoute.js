const express = require('express');
const router = express.Router();
const Genres = require("../models/genre");

router.post('/', async (req, res) => {
    try {
        const id = req.body.id;
        const genre = await Genres.findOne({ id: id });

        if(genre)
            res.status(200).json(genre);
        else
            res.status(404).json({ error: 'Genre not found' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const genres = await Genres.find().select('-_id -__v');
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({error: 'An error occurred'});
    }
});


module.exports = router;