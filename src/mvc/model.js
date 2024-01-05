import {defaultCityName} from './controller.js'
import {
    citySearchUrl,
    getDateTimeByLatLonUrl,
    getForecastByLocationUrl
} from "../helpers/url-builder.js";

export async function fetchData(url) {
    let data;

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        data = await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }

    return data;
}

export async function citySearch(pattern) {
    let url = citySearchUrl(pattern);
    let resp = await fetchData(url);

    if (resp.list > 0) {
        defaultCityName = resp.list[0].name;
    }

    return resp;
}

export async function getCityLocalDateTime(lat, lon) {
    let url = getDateTimeByLatLonUrl(lat, lon);

    return await fetchData(url);
}

export async function getForecastByLocation(lat, lon, units = "celsius") {

    let forecastRespData;

    if (units === "celsius") {
        forecastRespData = await fetchData(getForecastByLocationUrl(lat, lon, 'metric'));
    } else {
        forecastRespData = await fetchData(getForecastByLocationUrl(lat, lon, 'imperial'));
    }

    return forecastRespData;
}