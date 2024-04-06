const express = require('express');
const router = express.Router();
const Movies = require('../models/movie');
const Requests = require('../models/request');

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
                Object.entries(params).map(([key, value]) => ['request' + key, value])
            ),
            {},
            {
                ignoreUndefined: true
            }
        );

        if(localResult && localResult.length > 0) {
            res.status(200).json(localResult[0].response);
        } else {
            await fetch('https://api.themoviedb.org/3/discover/movie?' + new URLSearchParams(params), {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            })
                .then(response => response.json())
                .then(async data => {

                    console.log('params', params);
                    const request = new Requests({
                        request: params,
                        response: data.results
                    });

                    const movies = data.results.map(movie => new Movies(movie));

                    try {
                        await request.save();
                    } catch (error) {
                        console.log(error);
                    }

                    try {
                        await Movies.insertMany(movies);
                    } catch (error) {
                        if(error.code !== 11000)
                            throw error;
                    }

                    res.status(201).json(request.response);
                });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = req.body.id;
        const movie = await Movies.findOne({ id: id });

        if(movie) {
            res.status(200).json(movie);
            return;
        }

        fetch(`https://api.themoviedb.org/3/movie/${id}`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        })
            .then(response => response.json())
            .then(async data => {
                const movie = new Movies(data);
                await movie.save();
                res.status(201).json(movie);
            });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;