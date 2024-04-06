
const database = require('../database/database');

const languageSchema = new database.Schema({
    iso_639_1: { type: String, required: true, unique: true },
    english_name: { type: String, required: true },
    name: { type: String, required: true }
}, { collection: 'language' });

module.exports = database.model('Language', languageSchema);