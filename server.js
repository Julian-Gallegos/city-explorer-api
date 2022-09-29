'use strict';
// Set Up:
// ----------------------------------------------------------------

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
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


/* Like import, but it takes an external module,
   and does not need to be at the top of file,
   can be called conditioally.*/
require('dotenv').config();
// express server
const express = require('express');
// Allows for Cross Origin Resources Sharing
const cors = require('cors');
// load data
const data = require('./data/weather.json');
// start our server
const app = express();

const axios = require('axios'); // TODO:

// Middleware
// The app.use() function is used to mount the specified middleware function(s) at the path which is being specified
app.use(cors());

// Declare our PORT variable
const PORT = process.env.PORT || 3001; // || in case there is an issue with env variables

// Listening for connection
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

// Declare endpoints: Will later modularize these get statements so they are in their own files
// --------------------------------------------------------------------
//demo example uses home route '/'
app.get('/', (req, res) => {
    res.send('Hello from the home route!');
});

app.get('/weather', getWeather);

app.get('/movies', getMovies);

// Catch all endpoint: make sure this is at the end of the endpoint checks, similar to a switch default case.

app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

async function getWeather(req, res) {
    //const searchQuery = req.query.query;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    try {
        const weatherResponse = await axios.get(url);
        let forecastArray = weatherResponse.data.data.map(obj => {
            let date = obj.datetime;
            let low = obj.min_temp;
            let high = obj.max_temp;
            let weather = obj.weather.description;
            let description = `Low of ${low}, high of ${high} with ${weather}`;
            return new Forecast(date, description);
        });
        res.status(200).send(forecastArray);
    } catch (error) {
        res.status(500).send(`server error ${error}`)
    }
}

async function getMovies(req, res) {
    const searchQuery = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}`;
    try {
        const movieResponse = await axios.get(url);
        let moviesArray = [];
        for (let i = 0; i < movieResponse.data.results.length || i < 20; i++) {
            let result = movieResponse.data.results[i];
            moviesArray.push(new Movie(result.original_title, result.overview, result.vote_average, result.vote_count, 'https://image.tmdb.org/t/p/w500'+result.poster_path, result.popularity, result.release_date));
        }
        res.status(200).send(moviesArray);
    } catch (error) {
        res.status(500).send(`server error ${error}`);
    }

}