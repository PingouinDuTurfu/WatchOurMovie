const database = require('../database/database');

const querySchema = new database.Schema({
    request: {
        include_adult: { type: Boolean },
        language: { type: String },
        page: { type: Number },
        region: { type: String },
        query: { type: String, required: true },
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
            vote_count: { type: Number },
            language: { type: String }
        }
    ]
});

module.exports = database.model('Query', querySchema);