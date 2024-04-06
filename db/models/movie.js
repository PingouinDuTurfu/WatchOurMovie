const database = require('../database/database');

const movieSchema = new database.Schema({
    adult: { type: Boolean },
    genre_ids: { type: [Number] },
    id: { type: Number, unique: true, required: true },
    original_language: { type: String },
    original_title: { type: String },
    overview: { type: String },
    popularity: { type: Number },
    poster_path: { type: String },
    release_date: { type: String },
    title: { type: String },
    video: { type: Boolean },
    vote_average: { type: Number },
    vote_count: { type: Number }
}, { collection: 'movies' });

module.exports = database.model('Movie' , movieSchema);