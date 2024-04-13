const database = require('../database/database');

const profilSchema = new database.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    language: { type: String, required: true },
    moviesSeen: [
        {
            name: {type: String, required: true},
            id: {type: Number, required: true},
            _id: false
        }
    ],
    preferenceGenres: [
        {
            name: {type: String, required: true},
            id: {type: Number, required: true},
            _id: false
        }
    ],
    groups: [
        {
            groupName: { type: String, required: true },
        }
    ]
}, { collection: 'profils' });

module.exports = database.model('Profil', profilSchema);