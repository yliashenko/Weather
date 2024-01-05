import {
    changeUnitsRadioElement,
    cityInputElement,
    cityElement,
    dateTimeElement,
    forecastTable,
    humidityElement,
    pressureElement,
    temperatureElement,
    tempFeelsLikeElement,
    tempMaxElement,
    tempMinElement,
    windElement,
    conditionsElement,
    recentSearchElement,
    currentWeatherIconElement,
    contentElement,
    dateTimeLocalElement,
    countryElement,
    sunriseElement,
    sunsetElement
} from "../dom.js";

import {
    celsiusToFahrenheit,
    degreesToDirection,
    formatCityLocalDateTime,
    formatWeatherUpdatedDateTime,
    metersPerSecondToMilesPerHour
} from "../helpers/helpers.js";

export function renderUpdatedDate() {
    let updatedDate = new Date();

    dateTimeElement.innerHTML = `Updated: ${formatWeatherUpdatedDateTime(updatedDate)}`;
}

export function renderLocalDateTime(dateTime) {

    countryElement.innerHTML = `${dateTime.countryName}, ${dateTime.countryCode} (${dateTime.abbreviation})`;
    dateTimeLocalElement.innerHTML = `Local time: ${formatCityLocalDateTime(dateTime.formatted)}`;
}

export function renderSunTimes(sunrise, sunset) {

    sunriseElement.innerHTML = `Sunrise: ${sunrise}`;
    sunsetElement.innerHTML = `Sunset: ${sunset}`;
}

export function renderCurrentCity(city) {
    cityElement.innerHTML = `${city}`;
}

export function renderUpdatedRecentSearches() {

    let recentSearch = localStorage.getItem('recents');

    let recentArray = JSON.parse(recentSearch)

    if (recentArray) {
        recentSearchElement.innerHTML = 'Recent: ';

        for (let i = 0; (i < recentArray.length) && (i < 3); i++) {
            let item = document.createElement('p');

            let index = i;
            item.id = `A${index}`;

            recentSearchElement.append(item);

            let recentCity = document.querySelector(`#A${index}`);

            recentCity.innerHTML = `${recentArray[i]}`;
        }
    }
}

export function renderTempUnits() {

    let storedDefaultTempUnits = localStorage.getItem('defaultTempUnits');

    let radioChecked;
    if (storedDefaultTempUnits) {
        radioChecked = changeUnitsRadioElement.querySelector(`#${storedDefaultTempUnits}`);
    } else {
        radioChecked = changeUnitsRadioElement.querySelector(`#celsiusRadio`);
    }
    radioChecked.checked = true;
}

export function renderCurrentWeather(
    units,
    currentWeatherObjFormatted,
) {

    currentWeatherIconElement.innerHTML = '';

    let obj = currentWeatherObjFormatted;

    if (units === 'fahrenheitRadio') {
        if (obj.temp && (obj.feelsLike !== undefined)) {
            temperatureElement.innerHTML = `${celsiusToFahrenheit(obj.temp)}F°`;
            tempFeelsLikeElement.innerHTML = `Feels like: ${celsiusToFahrenheit(obj.feelsLike)}°`;
        }
        if (obj.tempMin !== undefined) tempMinElement.innerHTML = `Min: ${celsiusToFahrenheit(obj.tempMin)}°`;
        if (obj.tempMax !== undefined) tempMaxElement.innerHTML = `Max: ${celsiusToFahrenheit(obj.tempMax)}°`;
        if (obj.speed && obj.deg) windElement.textContent = `Wind: ${metersPerSecondToMilesPerHour(obj.speed)} mph, (${degreesToDirection(obj.deg)})`;
    } else {
        if (obj.temp && (obj.feelsLike !== undefined)) {
            temperatureElement.innerHTML = `${obj.temp}C°`;
            tempFeelsLikeElement.innerHTML = `Feels like: ${obj.feelsLike}°`;
        }
        if (obj.tempMin !== undefined) tempMinElement.innerHTML = `Min: ${obj.tempMin}°`;
        if (obj.tempMax !== undefined) tempMaxElement.innerHTML = `Max: ${obj.tempMax}°`;
        if (obj.speed && obj.deg) windElement.textContent = `Wind: ${obj.speed} m/s, (${degreesToDirection(obj.deg)})`;
    }

    if (obj.humidity) humidityElement.innerHTML = `Humidity: ${obj.humidity} g/m<sup>3</sup>`;
    if (obj.pressure) pressureElement.innerHTML = `Pressure: ${obj.pressure} Pa`;
    if (obj.weatherDescription) conditionsElement.innerHTML = `${obj.weatherDescription[0].toUpperCase() + obj.weatherDescription.substring(1)}`
    if (obj.weatherDescriptionCode) currentWeatherIconElement.innerHTML = `<img src="${currentWeatherConditionIconSelect(obj.weatherDescriptionCode)}" alt="cond-icon">`;

    let cityLocalTime = new Date().toLocaleString("en-GB", {timeZone: 'Europe/Amsterdam'});
    backgroundImageSelect(obj.weatherDescriptionCode);

}

export function renderForecast(
    units,
    forecastObjFormatted
) {

    forecastTable.innerHTML = '';

    forecastObjFormatted.forEach((day, i) => {
        let index = ++i;

        // HTML insert
        addRow(
            forecastTable,
            units,
            day.date,
            day.tempMin,
            day.tempMax,
            day.conditions,
            day.conditionId)
    })
}

export function clearSearchInputField() {
    cityInputElement.value = '';
}

function addRow(element, units, date, tempMin, tempMax, conditions, icon) {
    let tr = document.createElement("tr");
    tr.insertAdjacentHTML("beforeend", `<td>${date}</td>`);
    tr.insertAdjacentHTML("beforeend", `<img src="${currentWeatherConditionIconSelect(icon)}" alt="cond-icon">`);

    if (units === 'fahrenheitRadio') {
        tr.insertAdjacentHTML("beforeend", `<td>${celsiusToFahrenheit(tempMin)}° / ${celsiusToFahrenheit(tempMax)}°</td>`);
    } else {
        tr.insertAdjacentHTML("beforeend", `<td>${tempMin}° / ${tempMax}°</td>`);
    }
    tr.insertAdjacentHTML("beforeend", `<td>${conditions[0].toUpperCase() + conditions.substring(1)}</td>`);
    element.append(tr);
}

function currentWeatherConditionIconSelect(conditionsId) {
    let iconSrc;

    switch (true) {
        case (200 <= conditionsId && conditionsId <= 232):
            iconSrc = "/src/assets/icons/white/weather7.png";
            break;
        case (300 <= conditionsId && conditionsId <= 321):
        case (500 <= conditionsId && conditionsId <= 504):
            iconSrc = "/src/assets/icons/white/weather8.png";
            break;
        case (520 <= conditionsId && conditionsId <= 531):
            iconSrc = "/src/assets/icons/white/weather8.png";
            break;
        case conditionsId === 511:
        case (600 <= conditionsId && conditionsId <= 622):
            iconSrc = "/src/assets/icons/white/weather24.png";
            break;
        case (701 <= conditionsId && conditionsId <= 781):
            iconSrc = "/src/assets/icons/white/weather17.png";
            break;
        case conditionsId === 800:
            iconSrc = "/src/assets/icons/white/weather2.png";
            break;
        case conditionsId === 801:
            iconSrc = "/src/assets/icons/white/weather.png";
            break;
        case conditionsId === 802:
            iconSrc = "/src/assets/icons/white/weather3.png";
            break;
        case conditionsId === 803:
        case conditionsId === 804:
            iconSrc = "/src/assets/icons/white/weather4.png";
            break;
        default:
            iconSrc = "/src/assets/icons/white/weather23.png"
            break;
    }

    return iconSrc;
}

function backgroundImageSelect(conditionsId) {
    let currentDate = new Date();

    let hours = currentDate.getHours();

    if (conditionsId) {
        switch (true) {
            case conditionsId === 800:
                if (hours <= 17 && hours >= 7) {
                    contentElement.style.backgroundImage = `url(/src/assets/img/clear.jpg)`;
                    contentElement.style.backgroundPosition = `center -560px`;
                    contentElement.style.backgroundSize = `150%`;
                    contentElement.style.backgroundRepeat = `none`;
                } else {
                    contentElement.style.backgroundImage = `url(/src/assets/img/clear-night.jpg)`;
                    contentElement.style.backgroundPosition = `center`;
                    contentElement.style.backgroundSize = `100%`;
                }
                break;
            case (200 <= conditionsId && conditionsId <= 232):
                if (hours <= 17 && hours >= 7) {
                    contentElement.style.backgroundImage = `url(src/assets/img/thunderstorm.jpg)`;
                    contentElement.style.backgroundPosition = `center -520px`;
                    contentElement.style.backgroundSize = `130%`;
                } else {
                    contentElement.style.backgroundImage = `url(/src/assets/img/thunderstorm-night.jpg)`;
                    contentElement.style.backgroundPosition = `center -145px`;
                    contentElement.style.backgroundSize = `100%`;
                }
                break;
            case (300 <= conditionsId && conditionsId <= 321):
            case (500 <= conditionsId && conditionsId <= 504):
            case (520 <= conditionsId && conditionsId <= 531):
                contentElement.style.backgroundImage = `url(/src/assets/img/rain.jpg)`;
                contentElement.style.backgroundPosition = `center -39px`;
                contentElement.style.backgroundSize = `100%`;
                break;
            case conditionsId === 511:
            case (600 <= conditionsId && conditionsId <= 622):
                contentElement.style.backgroundImage = `url(/src/assets/img/snow.jpg)`;
                contentElement.style.backgroundPosition = `center -80px`;
                contentElement.style.backgroundSize = `100%`;
                break;
            case (701 <= conditionsId && conditionsId <= 781):
                contentElement.style.backgroundImage = `url(/src/assets/img/fog.jpg)`;
                contentElement.style.backgroundPosition = `center -500px`;
                contentElement.style.backgroundSize = `100%`;
                break;
            case conditionsId === 801:
                if (hours <= 17 && hours >= 7) {
                    contentElement.style.backgroundImage = `url(/src/assets/img/clouds-sun.jpg)`;
                    contentElement.style.backgroundPosition = `center -90px`;
                    contentElement.style.backgroundSize = `130%`;
                } else {
                    contentElement.style.backgroundImage = `url(/src/assets/img/clouds-moon.jpg)`;
                    contentElement.style.backgroundPosition = `center`;
                    contentElement.style.backgroundSize = `100%`;
                }
                break;
            case conditionsId === 802:
                if (hours <= 17 && hours >= 7) {
                    contentElement.style.backgroundImage = `url(/src/assets/img/light-clouds.jpg)`;
                    contentElement.style.backgroundPosition = `center -70px`;
                    contentElement.style.backgroundSize = `100%`;
                } else {
                    contentElement.style.backgroundImage = `url(/src/assets/img/clouds-moon.jpg)`;
                    contentElement.style.backgroundPosition = `center`;
                    contentElement.style.backgroundSize = `100%`;
                }
                break;
            case conditionsId === 803:
            case conditionsId === 804:
                contentElement.style.backgroundImage = `url(/src/assets/img/overcast.jpg)`;
                contentElement.style.backgroundPosition = `center -60px`;
                contentElement.style.backgroundSize = `200%`;
                break;
        }
    }
}