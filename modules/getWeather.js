'use strict';

const axios = require('axios');
const cache = require('./cache');

async function getWeather(req, res) {
    //const searchQuery = req.query.query;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const key = 'weather-'+lat+lon;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
        console.log('Cache hit');
    } else {
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
            cache[key] = {};
            cache[key].timestamp = Date.now();
            cache[key].data = forecastArray;
        } catch (error) {
            res.status(500).send(`server error ${error}`)
        }
    }

    res.status(200).send(cache[key].data);
}

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

// Node export syntax:
module.exports = getWeather;