'use strict';
// Set Up:
// ----------------------------------------------------------------

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
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

app.get('/weather', (req, res) => {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let searchQuery = req.query.query;
    let matchedQuery = data.find(item => item.city_name.toUpperCase() === searchQuery.toUpperCase());
    if (!matchedQuery && matchedQuery.city_name !== 'Seattle' && matchedQuery.city_name !== 'Paris' && matchedQuery.city_name !== 'Amman') {
        res.status(400).send('City Query Failed');
    } else {
        let forecastArray = [];
        for(let i = 0; i < matchedQuery.data.length; i++) {
            let date = matchedQuery.data[i].datetime;
            let low = matchedQuery.data[i].low_temp;
            let high = matchedQuery.data[i].high_temp;
            let weather = matchedQuery.data[i].weather.description;
            let description = `Low of ${low}, high of ${high} with ${weather}`;
            forecastArray.push(new Forecast(date, description));
        }
        res.send(forecastArray);
    }
});

app.get('/Data', (req, res) => {
    res.send(data[0].weather);
})

// Catch all endpoint: make sure this is at the end of the endpoint checks, similar to a switch default case.

app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});