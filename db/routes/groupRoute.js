const express = require('express');
const router = express.Router();
const Profils = require('../models/profil');

router.get('/', async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const profils = await Profils.find({ 'groups.groupId': groupId });
        if(profils)
            res.status(200).json(profils);
        else
            res.status(404).json({ error: 'Group not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const userId = req.params.userId;
        const groupName = req.body.groupName;

        const arlreadyExist = await Profils.findOne({ 'groups.groupName': groupName });

        if(arlreadyExist)
            return res.status(409).json({ error: 'Group already exists' });

        await Profils.findOneAndUpdate({ userId: userId }, { $push: { groups: { groupName: groupName } } });
        res.status(200).json({ groupName: groupName });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/leave', async (req, res) => {
    try {
        const userId = req.params.userId;
        const groupId = req.body.groupId;
        const profil = await Profils.findOneAndUpdate({ userId: userId }, { $pull: { groups: { groupId: groupId } } });
        res.status(200).json(profil);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/join', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { groupId, groupName } = req.body;
        const profil = await Profils.findOneAndUpdate({ userId: userId }, { $push: { groups: { groupId: groupId, groupName: groupName } } });
        res.status(200).json(profil);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;