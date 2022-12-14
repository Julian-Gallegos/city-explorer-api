'use strict';

const axios = require('axios');
let cache = require('./cache');

async function getMovies(req, res) {
    const searchQuery = req.query.query;
    const key = 'movie-' + searchQuery;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;

    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
        console.log('Cache hit');
    } else {
        try {
            const movieResponse = await axios.get(url);
            let moviesArray = [];
            for (let i = 0; i < movieResponse.data.results.length || i < 20; i++) {
                let result = movieResponse.data.results[i];
                moviesArray.push(new Movie(result.original_title, result.overview, result.vote_average, result.vote_count, 'https://image.tmdb.org/t/p/w500' + result.poster_path, result.popularity, result.release_date));
            }
            cache[key] = {};
            cache[key].timestamp = Date.now();
            cache[key].data = moviesArray;
        } catch (error) {
            res.status(500).send(`server error ${error}`);
        }
    }

    res.status(200).send(cache[key].data);
}

class Movie {
    constructor(title, overview, average_votes, total_votes, image_url, popularity, released_on) {
        this.title = title;
        this.overview = overview;
        this.average_votes = average_votes;
        this.total_votes = total_votes;
        this.image_url = image_url;
        this.popularity = popularity;
        this.released_on = released_on;
    }
}

module.exports = getMovies;