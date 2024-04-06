const express = require('express');
const router = express.Router();
const Profils = require('../models/profil');

router.get('/', async (req, res) => {
    try {
        const id = req.query.id;
        const profils = await Profils.findOne({ id: id });
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
        const { clientId, name, lastname, age, language } = req.body;

        const profils = await Profils.findOne({ clientId: clientId });

        if(profils)
            res.status(409).json({ error: 'Profil already exists' });

        const preferenceGenres = [];
        const groups = [];

        req.body.groups.forEach(group => {
            if(group.groupId && group.groupName)
                groups.push({ groupId: group.groupId, groupName: group.groupName });
        });

        req.body.preferenceGenres.forEach(genre => {
            if(genre)
                preferenceGenres.push(genre);
        });

        const profil = new Profils({
            clientId: clientId,
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
        const { clientId, movieId } = req.body;

        const profils = await Profils.findOneAndUpdate({ clientId: clientId }, { $addToSet: { moviesSeen: movieId } }, { new: true });

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


module.exports = router;