const express = require('express');
const router = express.Router();
const Profils = require('../models/profil');

router.get('/', async (req, res) => {
    try {
        const groupName = req.query.groupName;
        const profils = await Profils.find({ 'groups.groupName': groupName });
        if(profils)
            res.status(200).json(profils);
        else
            res.status(404).json({ error: 'Group not found' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { userId, groupName } = req.body;

        const alreadyExist = await Profils.findOne({ 'groups.groupName': groupName });

        if(alreadyExist)
            return res.status(409).json({ error: 'Group already exists' });

        const profil = await Profils.findOneAndUpdate({ userId: userId }, { $push: { groups: { groupName: groupName }}}, { new: true });
        res.status(200).json(profil);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/leave', async (req, res) => {
    try {
        const { userId, groupName } = req.body;

        const profil = await Profils.findOneAndUpdate({ userId: userId }, { $pull: { groups: { groupName: groupName }}}, { new: true });
        res.status(200).json(profil);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/join', async (req, res) => {
    try {
        const { userId, groupName } = req.body;
        const profil = await Profils.findOneAndUpdate({ userId: userId }, { $addToSet: { groups: { groupName: groupName }}}, { new: true });
        res.status(200).json(profil);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const groups = await Profils.find().select('groups -_id');
        const distinctGroups = new Set();
        groups.forEach(groupList => {
            if(!groupList.groups)
                return;

            groupList.groups.forEach(group => {
                if(group.groupName)
                    distinctGroups.add(group.groupName);
            })
        });
        res.status(200).json(Array.from(distinctGroups));
    } catch (error) {
        res.status(500).json({error: 'An error occurred'});
    }
});

module.exports = router;