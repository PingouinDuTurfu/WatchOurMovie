const express = require('express');
const router = express.Router();
const Profils = require('../models/profil');

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const profils = await Profils.findOne({ userId: userId });
        if(profils)
            res.status(200).json(profils);
        else
            res.status(404).json({ error: 'Profil not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/fromUsername', async (req, res) => {
    try {
        const username = req.query.username;
        const profils = await Profils.findOne({ username: username });
        if(profils)
            res.status(200).json(profils);
        else
            res.status(404).json({ error: 'Profil not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/firstConnection', async (req, res) => {
    try {
        const { userId, username, name, lastname, age, language } = req.body;

        const profils = await Profils.findOne({ userId: userId });

        if(profils)
            res.status(409).json({ error: 'Profil already exists' });

        const preferenceGenres = [];
        const groups = [];



        req.body.preferenceGenres.forEach(genre => {
            if(genre)
                preferenceGenres.push(genre);
        });

        const profil = new Profils({
            userId: userId,
            username: username,
            name: name,
            lastname: lastname,
            age: age,
            language: language,
            moviesSeen: [],
            preferenceGenres: preferenceGenres,
            groups: groups
        });

        await profil.save();
        res.status(201).json(profil);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/addSeenMovie', async (req, res) => {
    try {
        const { userId, movie } = req.body;

        const profils = await Profils.findOneAndUpdate({ userId: userId }, { $addToSet: { moviesSeen: movie } }, { new: true });

        if(profils) {
            res.status(200).json(profils);
        } else {
            res.status(404).json({ error: 'Profil not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const profils = await Profils.find();
        res.status(200).json(profils);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


module.exports = router;