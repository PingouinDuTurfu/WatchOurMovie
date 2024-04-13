const express = require('express');
const router = express.Router();
const Movies = require('../models/movie');
const Requests = require('../models/request');
const Query = require('../models/query');
const Recommendations = require('../models/recommendation');

router.post('/', async (req, res) => {
    try {
        const { id, language } = req.body;
        const movie = await Movies.findOne({ id: id, language: language });

        if(movie) {
            res.status(200).json(movie);
            return;
        }

        fetch(`https://api.themoviedb.org/3/movie/${id}?language=${language}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                data["genre_ids"]= data["genres"].map(genre => genre.id);
                data["language"]=language;
                const movie = new Movies(data);
                await movie.save();
                res.status(201).json(movie);
            });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/discover', async (req, res) => {
    try {
        const { include_adult, language, page, region, sort_by, with_genres, with_keywords, with_people, without_genres, without_keywords, year } = req.body;

        const params = Object.fromEntries(
            Object.entries({
                include_adult: include_adult ?? false,
                language: language,
                page: page ?? 1,
                region: region,
                sort_by: sort_by,
                with_genres: with_genres,
                with_keywords: with_keywords,
                with_people: with_people,
                without_genres: without_genres,
                without_keywords: without_keywords,
                year: year
            }).filter(([_, value]) => value)
        );

        const localResult = await Requests.find(
            Object.fromEntries(
                Object.entries(params).map(([key, value]) => ['request.' + key, value])
            ),
            {},
            {
                ignoreUndefined: true
            }
        );

        if(localResult && localResult.length > 0) {
            res.status(200).json(localResult[0].response);
            return;
        }

        await fetch('https://api.themoviedb.org/3/discover/movie?' + new URLSearchParams(params), {
            method: 'GET',
            headers: {
                authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                const request = new Requests({
                    request: params,
                    response: data.results
                });

                const movies = data.results.map(movie => {
                    movie["language"] = language;
                    return new Movies(movie);
                });

                await request.save();

                try {
                    await Movies.insertMany(movies);
                } catch (error) {
                    if(error.code !== 11000)
                        throw error;
                }

                res.status(201).json(request.response);
            });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/search', async (req, res) => {
    try {
        const { include_adult, language, page, query } = req.body;

        const params = Object.fromEntries(
            Object.entries({
                include_adult: include_adult ?? false,
                language: language,
                page: page ?? 1,
                query: query
            }).filter(([_, value]) => value)
        );

        const localResult = await Query.find(
            Object.fromEntries(
                Object.entries(params).map(([key, value]) => ['request.' + key, value])
            ),
            {},
            {
                ignoreUndefined: true
            }
        );

        if(localResult && localResult.length > 0) {
            res.status(200).json(localResult[0].response);
            return;
        }

        await fetch('https://api.themoviedb.org/3/search/movie?' + new URLSearchParams(params), {
            method: 'GET',
            headers: {
                authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                data["language"] = language
                const query1 = new Query({
                    request: params,
                    response: data.results
                });

                const movies = data.results.map(movie => {
                    movie["language"] = language;
                    return new Movies(movie);
                });

                await query1.save();

                try {
                    await Movies.insertMany(movies);
                } catch (error) {
                    if(error.code !== 11000)
                        throw error;
                }

                res.status(201).json(query1.response);
            });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/recommendation', async (req, res) => {
    try {
        const { movie_id, language, page } = req.body;

        const params = Object.fromEntries(
            Object.entries({
                movie_id: movie_id,
                language: language,
                page: page ?? 1
            }).filter(([_, value]) => value)
        );

        const localResult = await Recommendations.find(
            Object.fromEntries(
                Object.entries(params).map(([key, value]) => ['request.' + key, value])
            ),
            {},
            {
                ignoreUndefined: true
            }
        );

        if(localResult && localResult.length > 0) {
            res.status(200).json(localResult[0].response);
            return;
        }
        await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?` + new URLSearchParams(params), {
            method: 'GET',
            headers: {
                authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                data["language"] = language
                const request = new Recommendations({
                    request: params,
                    response: data.results
                });

                const movies = data.results.map(movie => {
                    movie["language"] = language;
                    return new Movies(movie);
                });



                await request.save();

                try {
                    await Movies.insertMany(movies);
                } catch (error) {
                    if(error.code !== 11000)
                        throw error;
                }

                res.status(201).json(request.response);
            });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;