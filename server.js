'use strict';
// Set Up:
// ----------------------------------------------------------------

/* Like import, but it takes an external module,
   and does not need to be at the top of file,
   can be called conditioally.*/
require('dotenv').config();
// express server
const express = require('express');
// Allows for Cross Origin Resources Sharing
const cors = require('cors');
// start our server
const app = express();
const getWeather = require('./modules/getWeather');
const getMovies = require('./modules/getMovies');

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
