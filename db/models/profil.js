const database = require('../database/database');

const profilSchema = new database.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    age: { type: Number, required: true },
    language: { type: String, required: true },
    moviesSeen: { type: [Number], required: true },
    preferenceGenres: { type: [String], required: true },
    groups: [
        {
            groupId: { type: String, required: true },
            groupName: { type: String, required: true },
        }
    ]
}, { collection: 'profils' });

module.exports = database.model('Profil', profilSchema);