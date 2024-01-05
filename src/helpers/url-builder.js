let weatherBaseUrl = 'https://api.openweathermap.org/data/';
let weatherApiKey = '057a748e6d45bc4a3e6e4ec6676d4853';

let timeZoneBaseUrl = 'http://api.timezonedb.com/v2.1/';
let timeZoneApiKey = 'SX3YU3R5I1MG';

export function citySearchUrl(cityName, units = 'metric') {
    return `${weatherBaseUrl}2.5/find?q=${cityName}&appid=${weatherApiKey}&units=${units}`;
}

export function getForecastByLocationUrl(lat, lon, units) {
    return `${weatherBaseUrl}2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${weatherApiKey}&units=${units}`;
}

export function getDateTimeByLatLonUrl(lat, lon) {
    return `${timeZoneBaseUrl}get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;
}