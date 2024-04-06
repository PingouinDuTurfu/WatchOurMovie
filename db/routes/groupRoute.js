const express = require('express');
const router = express.Router();
const Profils = require('../models/profil');

router.get('/', async (req, res) => {
    try {
        const groupId = req.query.id;
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
        const { clientId, groupName } = req.body;
        const group = {
            groupId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            groupName: groupName
        }
        await Profils.findOneAndUpdate({ clientId: clientId }, { $push: { groups: group } });
        res.status(200).json(group);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/leave', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const groupId = req.body.groupId;
        const profil = await Profils.findOneAndUpdate({ clientId: clientId }, { $pull: { groups: { groupId: groupId } } });
        res.status(200).json(profil);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/join', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const { groupId, groupName } = req.body;
        const profil = await Profils.findOneAndUpdate({ clientId: clientId }, { $push: { groups: { groupId: groupId, groupName: groupName } } });
        res.status(200).json(profil);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;