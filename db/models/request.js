const database = require('../database/database');

const requestSchema = new database.Schema({
    request: {
        include_adult: { type: Boolean },
        language: { type: String },
        page: { type: Number },
        region: { type: String },
        sort_by: { type: String },
        with_genres: { type: [Number] },
        with_keywords: { type: [String] },
        with_people: { type: [String] },
        without_genres: { type: [Number] },
        without_keywords: { type: [String] },
        year: { type: Number }
    },
    response: [
        {
            adult: { type: Boolean },
            genre_ids: { type: [Number] },
            id: { type: Number, required: true },
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
        }
    ]
});

module.exports = database.model('Request', requestSchema);