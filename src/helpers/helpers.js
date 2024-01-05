import {
    errorIfEmptySearchElement,
    errorIfNoResponseElement} from "../dom.js";

export function prepareCurrentWeatherData(obj) {
    return {
        cityName: obj.list[0].name,
        cityId: obj.list[0].id,
        temp: Math.round(obj.list[0].main.temp),
        feelsLike: Math.round(obj.list[0].main.feels_like),
        humidity: Math.round(obj.list[0].main.humidity),
        pressure: Math.round(obj.list[0].main.pressure),
        tempMax: Math.round(obj.list[0].main.temp_max),
        tempMin: Math.round(obj.list[0].main.temp_min),
        deg: obj.list[0].wind.deg,
        speed: Math.round(obj.list[0].wind.speed),
        weatherDescription: obj.list[0].weather[0].description,
        weatherDescriptionCode: obj.list[0].weather[0].id
    }
}

export function prepareForecastData(obj) {

    let arrayWithDays = filterByStringFragment(obj.list, '15:00:00');

    let formattedForecast = [];
    for (let i = 0; i < arrayWithDays.length; i++) {

        let currentDate = new Date();
        let forecastingDay = currentDate.getDate() + i;
        let forecastingDateFormatted = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${forecastingDay}`;

        let hoursOfDayArray = filterByStringFragment(obj.list, forecastingDateFormatted);
        let tempMinArray = filterAndSortArrayByTempMin(obj.list, hoursOfDayArray);
        let tempMaxArray = filterAndSortArrayByTempMax(obj.list, hoursOfDayArray);

        formattedForecast.push({
            date: getCurrentDateInCustomFormat(i),
            tempMin: Math.round(tempMinArray[0].main.temp_min),
            tempMax: Math.round(tempMaxArray[tempMaxArray.length - 1].main.temp_max),
            conditions: arrayWithDays[i].weather[0].description,
            conditionId: arrayWithDays[i].weather[0].id
        })
    }

    return formattedForecast;
}

export function degreesToDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

export function celsiusToFahrenheit(celsius) {
    return Math.round(celsius * 9 / 5 + 32);
}

export function isErrorIfNoResponseDisplayed(isDisplayed) {
    if (isDisplayed) {
        errorIfNoResponseElement.style.display = 'flex';
    } else {
        errorIfNoResponseElement.style.display = 'none';
    }
}

export function isErrorIfEmptySearchDisplayed(isDisplayed) {
    if (isDisplayed) {
        errorIfEmptySearchElement.style.display = 'flex';
    } else {
        errorIfEmptySearchElement.style.display = 'none';
    }
}

export function metersPerSecondToMilesPerHour(metersPerSecond) {
    const conversionFactor = 2.23694;
    const milesPerHour = metersPerSecond * conversionFactor;
    return Math.round(milesPerHour);
}

export function getCurrentDateInCustomFormat(dayMove) {
    let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let currentDate = new Date();

    let dayOfWeek = daysOfWeek[currentDate.getDay() + dayMove];
    let month = months[currentDate.getMonth()];
    let dayOfMonth = currentDate.getDate();

    if (dayOfMonth < 10) {
        dayOfMonth = '0' + dayOfMonth;
    }

    return `${dayOfWeek}, ${month} ${dayOfMonth + dayMove}`;
}

export function formatCityLocalDateTime(dateTime) {
    let dateObject = new Date(dateTime);

    return ("0" + dateObject.getDate()).slice(-2) +
        "." +
        ("0" + (dateObject.getMonth() + 1)).slice(-2) +
        "." +
        dateObject.getFullYear() +
        ", " +
        ("0" + dateObject.getHours()).slice(-2) +
        ":" +
        ("0" + dateObject.getMinutes()).slice(-2);
}

export function formatWeatherUpdatedDateTime(updatedDate) {

    let year = updatedDate.getFullYear();
    let month = updatedDate.getMonth() + 1;
    let day = updatedDate.getDate();
    let hours = updatedDate.getHours();
    let minutes = updatedDate.getMinutes();

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

function filterByStringFragment(dataArray, fragment) {
    return dataArray.filter(function (item) {
        return item.dt_txt.includes(fragment);
    });
}

function filterAndSortArrayByTempMin(obj1, obj2) {
    return obj1
        .filter(entry => entry.dt >= obj2[0].dt && entry.dt <= obj2[obj2.length - 1].dt)
        .sort((a, b) => a.main.temp_min - b.main.temp_min);
}

function filterAndSortArrayByTempMax(obj1, obj2) {
    return obj1
        .filter(entry => entry.dt >= `${obj2[0].dt}` && entry.dt <= `${obj2[obj2.length - 1].dt}`)
        .sort((a, b) => a.main.temp_max - b.main.temp_max);
}