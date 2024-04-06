const database = require('../database/database');

const genreSchema = new database.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
}, { collection: 'genres' });

module.exports = database.model('Genre', genreSchema);