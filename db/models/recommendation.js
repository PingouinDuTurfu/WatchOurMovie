const database = require('../database/database');

const recommendationSchema = new database.Schema({
    request: {
        movie_id: { type: Number, required: true },
        language: { type: String },
        page: { type: Number },
    },
    response: [
        {
            adult: { type: Boolean },
            backdrop_path: { type: String },
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
            vote_count: { type: Number },
            language: { type: String }
        }
    ]
});

module.exports = database.model('Recommendation', recommendationSchema);