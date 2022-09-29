'use strict';

import { get } from 'axios';

async function getWeather(req, res) {
    //const searchQuery = req.query.query;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    try {
        const weatherResponse = await get(url);
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

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

// Node export syntax:
module.exports = {getWeather};