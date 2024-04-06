const Genre = require("../models/genre");
const Language = require("../models/language");

const ALREADY_EXISTS_EXCEPTION = 11000;

function updateGenre() {
    fetch('https://api.themoviedb.org/3/genre/movie/list', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
        .then(response => response.json())
        .then(async data => {
            try {
                await Genre.insertMany(data.genres.map(genre => new Genre(genre)), {ordered: false});
            } catch (error) {
                if (error.code !== ALREADY_EXISTS_EXCEPTION)
                    throw error;
            }
        });
}

function updateLanguage() {
    fetch('https://api.themoviedb.org/3/configuration/languages', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TMDB_API_KEY}`
        }
    })
        .then(response => response.json())
        .then(async data => {
            try {
                await Language.insertMany(data.map(language => new Language(language)), {ordered: false});
            } catch (error) {
                if (error.code !== ALREADY_EXISTS_EXCEPTION)
                    throw error;
            }
        });
}

function initialize() {
    updateGenre();
    updateLanguage();
}

module.exports = {initialize, updateGenre, updateLanguage};