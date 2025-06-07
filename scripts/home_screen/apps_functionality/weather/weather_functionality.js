import { getElById } from '../../../utils/dom_selectors.js';

const APIkey = '8313317a31aef5337eed3f913d15621a';
// Free-tier API key for this project.
// Misuse triggers key rotation.
// In production, use secure storage.

const weatherIcons = [];
weatherIcons[1] = 'images/weather-images/Sunny.png';
weatherIcons[2] = 'images/weather-images/partly-cloudy.png';
weatherIcons[3] = weatherIcons[4] = 'images/weather-images/cloudy.png';
weatherIcons[10] = 'images/weather-images/rainy.png';
weatherIcons[11] = 'images/weather-images/thunderstorm.png';
weatherIcons[13] = 'images/weather-images/snowy.png';
weatherIcons[50] = 'images/weather-images/fog.png';

const weatherInput = getElById('weather-input');
const tempDegree = getElById('temp-degree');
const tempDescription = getElById('temp-description');
const cityName = getElById('city-name'); 
const humidPercent = getElById('humidity-percentage');
const windSpeedText = getElById('wind-speed');
const airPressureText = getElById('air-pressure');
const visibilityText = getElById('visibility');
const weatherImage = getElById('weather-display-image');
const weatherInfoElements = [humidPercent, windSpeedText, airPressureText, visibilityText];

const upComingForecastsEl = document.querySelectorAll('.upcoming-forecast-card');
const upComingDaysEl = document.querySelectorAll('.upcoming-day');
const upComingTempsEl = document.querySelectorAll('.upcoming-temp-degree');
const upComingIconsEl = document.querySelectorAll('.upcoming-weather-icon');

function average(arr) {
  let average = 0;
  arr.forEach(num => {
    average += num;
  })
  return average /= arr.length;
}

function mostFrequentEl(arr) {
  let maxCount = 0;
  let maxElem;

  for (let i = 0; i < arr.length; i++) {
    let count = 0;
    for (let j = 0; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        count++;
      }
    }
    if (count > maxCount) {
      maxCount = count;
      maxElem = arr[i];
    }
  }

  return maxElem;
}

function getWeekday(date) {
  const day = new Date(date);
  return day.toLocaleString('en-US', { weekday: 'long' });
}

function getAverageTemperatures(temps) {
  let prevDay = temps[0].dt_txt.split(' ')[0]
  let dayCount = 0;
  let dayTemps = [];
  let dayIcons = [];
  const averageTemps = [];


  for (let i = 0; i < temps.length; i++) {
    const forecast = temps[i];
    const currDay = forecast.dt_txt.split(' ')[0];

    
    if (prevDay !== currDay || !temps[i+1]) {
      dayCount++;
      averageTemps.push({day: getWeekday(prevDay), temp: Math.round(average(dayTemps)), icon: mostFrequentEl(dayIcons)});
      dayTemps = [];

    } else {
      dayTemps.push(forecast.main.temp);
      dayIcons.push(forecast.weather[0].icon);
    }

    prevDay = currDay;
  }

  return averageTemps;
}


async function fetchCoordinatesWeather(lat, lon) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`);
  const weatherData = await response.json();
  const currWeatherData = weatherData.list[0];

  const weatherIcon = currWeatherData.weather[0].icon;
  if (weatherIcons[parseInt(weatherIcon)]) {
    weatherImage.src = weatherIcons[parseInt(weatherIcon)]; 
  } else {
    weatherImage.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  }

  const averageTemps = getAverageTemperatures(weatherData.list);

  const fullReport = {
    city: weatherData.city.name,
    countryCode: weatherData.city.country,
    temp: Math.round(currWeatherData.main.temp),
    description: currWeatherData.weather[0].description,
    humidity: currWeatherData.main.humidity,
    windSpeed: Math.round(currWeatherData.wind.speed),
    airPressure: currWeatherData.main.pressure,
    visibility: Math.round(currWeatherData.visibility/1000),
    upComingHours: {},
    upComingDays: {}
  }
  
  for (let i = 1; i < averageTemps.length; i++) {
    const currDay = averageTemps[i];
    fullReport.upComingDays[currDay.day] = {temp: currDay.temp, icon: currDay.icon};
   }



  return fullReport;
}

async function fetchCityCoordinates(city) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}`)
  const cityData = await response.json();

  const coordinates = cityData[0];
  if (!coordinates) return;

  return {
    lat: coordinates.lat,
    lon: coordinates.lon
  }
}

async function fetchCityWeather(city) {
  const coordinates = await fetchCityCoordinates(city);
  if (!coordinates) return;
  return await fetchCoordinatesWeather(coordinates.lat, coordinates.lon);
}

async function updateWeather(city) {
  const weather = await fetchCityWeather(city);
  if (!weather) {
    alert('City not found');
    return;
  }
  cityName.textContent = `${weather.city}, ${weather.countryCode}`;
  tempDegree.textContent = weather.temp;
  tempDescription.textContent = weather.description;
  humidPercent.textContent = weather.humidity;
  windSpeedText.textContent = weather.windSpeed;
  airPressureText.textContent = weather.airPressure;
  visibilityText.textContent = weather.visibility;

  for(let i = 0; i < weatherInfoElements.length; i++) {
    const el = weatherInfoElements[i];
    el.classList.add('flip');
    setTimeout(() => {
      el.classList.remove('flip');
    }, 150)
  }

  let i = 0;
  for (let key in weather.upComingDays) {
    if (!upComingDaysEl[i]) return;
    upComingDaysEl[i].textContent = key;
    upComingTempsEl[i].textContent = weather.upComingDays[key].temp;
    const card = upComingForecastsEl[i];
    card.classList.add('turn');
    setTimeout(() => {
      card.classList.remove('turn');
    }, 500)

    const weatherIcon = weather.upComingDays[key].icon;
    if (weatherIcons[parseInt(weatherIcon)]) {
      upComingIconsEl[i].src = weatherIcons[parseInt(weatherIcon)]; 
    } else {
      upComingIconsEl[i].src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    }
    i++;
  }
}


weatherInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (e.target.value.trim()) {
      updateWeather(e.target.value);
      e.target.blur();
      e.target.value = '';
    }
  }
})

updateWeather('Beirut');