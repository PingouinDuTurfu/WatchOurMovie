const database = require('../database/database');

const profilSchema = new database.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    language: { type: String, required: true },
    moviesSeen: [
        {
            title: {type: String, required: true},
            image: {type: String, required: true},
            id: {type: Number, required: true}
        }
    ],
    preferenceGenres: [
        {
            name: {type: String, required: true},
            id: {type: Number, required: true}
        }
    ],
    groups: [
        {
            groupName: { type: String, required: true },
        }
    ]
}, { collection: 'profils' });

module.exports = database.model('Profil', profilSchema);