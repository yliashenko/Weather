import {
    changeUnitsRadioElement,
    cityInputElement,
    citySearchButtonElement,
    recentSearchElement,
} from "../dom.js";

import {
    citySearch,
    getCityLocalDateTime,
    getForecastByLocation} from "./model.js";

import {
    isErrorIfEmptySearchDisplayed,
    isErrorIfNoResponseDisplayed,
    prepareCurrentWeatherData,
    prepareForecastData
} from "../helpers/helpers.js";

import {
    clearSearchInputField,
    renderCurrentCity,
    renderUpdatedDate,
    renderCurrentWeather,
    renderForecast,
    renderTempUnits,
    renderUpdatedRecentSearches,
    renderLocalDateTime,
    renderSunTimes
} from "./view.js";

export var defaultCityName = 'Kyiv';
export let lat = 0;
export let lon = 0;

let formattedCitySearchWeatherData;
let formattedForecastData;

renderTempUnits();
await getDefaultWeatherAndForecast();

citySearchButtonElement.addEventListener('click', async function () {

    if (cityInputElement.value) updateArrayInLocalStorage('recents', cityInputElement.value);

    await getCurrentWeather(cityInputElement.value);
    if (lat && lon) await getForecast(lat, lon);
})

cityInputElement.addEventListener('keydown', async function (e) {

    if (e.key === "Enter" && cityInputElement.value) {
        if (cityInputElement.value) updateArrayInLocalStorage('recents', cityInputElement.value);

        await getCurrentWeather(cityInputElement.value);
        if (lat && lon) await getForecast(lat, lon);
    }
})

recentSearchElement.addEventListener('click', async function (e) {

    await getCurrentWeather(e.target.innerText);
    if (lat && lon) await getForecast(lat, lon);
})

changeUnitsRadioElement.addEventListener('click', function (e) {

    localStorage.setItem('defaultTempUnits', e.target.id);

    if (formattedCitySearchWeatherData) {
        renderCurrentWeather(
            localStorage.getItem('defaultTempUnits'),
            formattedCitySearchWeatherData);
    }

    if (formattedForecastData) {
        renderForecast(
            localStorage.getItem('defaultTempUnits'),
            formattedForecastData)
    }
})

export async function getDefaultWeatherAndForecast() {

    let storedCityName = localStorage.getItem('defaultCityName');
    let defaultLong = localStorage.getItem(lat);
    let defaultLat = localStorage.getItem(lat);

    if ((storedCityName !== defaultCityName) && storedCityName !== null) {
        await getCurrentWeather(storedCityName);
    } else await getCurrentWeather(defaultCityName);

    if (defaultLat && defaultLong) await getForecast(defaultLat, defaultLong);
    else {
        let citySearchWeatherRespData;

        if (storedCityName) citySearchWeatherRespData = await citySearch(storedCityName);
        else citySearchWeatherRespData = await citySearch(defaultCityName);

        await getForecast(
            citySearchWeatherRespData.list[0].coord.lat,
            citySearchWeatherRespData.list[0].coord.lon
        )
    }
}

export async function getCurrentWeather(city) {
    defaultCityName = city;

    if (!defaultCityName) {
        isErrorIfNoResponseDisplayed(false);
        isErrorIfEmptySearchDisplayed(true);
    } else {
        isErrorIfEmptySearchDisplayed(false);

        let citySearchWeatherRespData;
        if (defaultCityName) {
            citySearchWeatherRespData = await citySearch(defaultCityName);
        }

        if (citySearchWeatherRespData.list.length > 0) {
            isErrorIfNoResponseDisplayed(false);

            lat = citySearchWeatherRespData.list[0].coord.lat;
            lon = citySearchWeatherRespData.list[0].coord.lon;

            let cityTimeZone = await getCityLocalDateTime(lat, lon);

            formattedCitySearchWeatherData = prepareCurrentWeatherData(citySearchWeatherRespData);

            let timesOfSun = calculateSunriseSunset(
                cityTimeZone.timestamp,
                cityTimeZone.gmtOffset,
                lat,
                lon);

            localStorage.setItem('defaultCityName', formattedCitySearchWeatherData.cityName);
            localStorage.setItem('lat', lat);
            localStorage.setItem('lon', lon);

            renderCurrentCity(formattedCitySearchWeatherData.cityName);
            renderUpdatedRecentSearches(formattedCitySearchWeatherData.cityName);

            renderCurrentWeather(
                localStorage.getItem('defaultTempUnits'),
                formattedCitySearchWeatherData);

            renderUpdatedDate();
            renderLocalDateTime(cityTimeZone);
            // renderSunTimes(timesOfSun.sunrise, timesOfSun.sunset);


        } else {
            isErrorIfNoResponseDisplayed(true);
        }
    }

    clearSearchInputField();
}

function calculateSunriseSunset(timestamp, gmtOffset, latitude, longitude) {
    // Convert timestamp to Date object
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

    // Apply the city's time zone offset
    date.setUTCMinutes(date.getUTCMinutes() + gmtOffset / 60);

    // Log the UTC values for debugging
    console.log("Adjusted Date (UTC):", date.toISOString());

    try {
        // Calculate sun times in UTC
        const timesUTC = SunCalc.getTimes(date, latitude, longitude);

        // Convert UTC times to local time zone
        const sunrise = new Date(timesUTC.sunrise).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
        const sunset = new Date(timesUTC.sunset).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });

        return { sunrise, sunset };
    } catch (error) {
        console.error("Error calculating sunrise and sunset:", error);
        return { sunrise: "Invalid Date", sunset: "Invalid Date" };
    }
}

export async function getForecast(lat, lon) {

    let forecastRespData;
    if (lat && lon) forecastRespData = await getForecastByLocation(lat, lon);

    if (forecastRespData.list.length > 0) {

        formattedForecastData = prepareForecastData(forecastRespData);

        renderForecast(
            localStorage.getItem('defaultTempUnits'),
            formattedForecastData);

    } else {
        isErrorIfNoResponseDisplayed(true);
    }
}

export function updateArrayInLocalStorage(key, newData) {

    const jsonData = localStorage.getItem(key);
    const existingData = jsonData ? JSON.parse(jsonData) : [];
    existingData.unshift(newData);
    localStorage.setItem(key, JSON.stringify(existingData));
}