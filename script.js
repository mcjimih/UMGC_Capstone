// Check if the script is running in a browser environment
if (typeof window !== 'undefined') {
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const switchElement = document.getElementById("toggleTemperature");
const callImperial = "units=imperial"
const callMetric = "units=metric"

let currentWeatherData = null;
let currentUnit = callMetric;

const fahrenheitSign = "°F";
const celsiusSign = "°C"
let currentTempUnit = celsiusSign;

const imperialWind = "mph";
const metricWind = "m/s"
let currentWindUnit = metricWind;


const API_KEY = "6b75e1f27bd464fbc659aabb6312388f"; // OpenWeatherMap API key

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return " ";
    } else {
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>Temp: ${(weatherItem.main.temp).toFixed(2)}${currentTempUnit}</h4>
                    <h4>Wind: ${weatherItem.wind.speed}${currentWindUnit}</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&${currentUnit}`;
    
    return new Promise((resolve, reject) => {
        fetch(WEATHER_API_URL)
            .then(res => res.json())
            .then(data => {
                currentWeatherData = data;
                const uniqueForecastDays = [];

                const sevenDaysForecast = data.list.filter(forecast => {
                    const forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(forecastDate)) {
                        return uniqueForecastDays.push(forecastDate);
                    }
                });

                // Clears old data
                cityInput.value = "";
                currentWeatherDiv.innerHTML = "";
                weatherCardsDiv.innerHTML = "";

                sevenDaysForecast.forEach((weatherItem, index) => {
                   weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                });

                resolve(); // Resolve the promise when data is fetched
            })
            .catch(error => {
                reject(error); // Reject the promise if there's an error
            });
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // deletes trailing spaces after user input
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            
            document.getElementById('cityName').textContent = name;
            getWeatherDetails(name, lat, lon)
                .then(() => {
                    const currentDate = currentWeatherData.list[0].dt_txt.split(" ")[0];
                    document.getElementById('currentDate').textContent = currentDate;
                    setCurrentWeatherCard();
                })
                .catch(error => {
                    alert(`An error occurred while fetching the weather details: ${error.message}`);
                });
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

const getLocalCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            // Pulls user location and searches for city
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            
            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    const { name } = data[0];
                
                    document.getElementById('cityName').textContent = name;
                    getWeatherDetails(name, latitude, longitude)
                        .then(() => {
                            const currentDate = currentWeatherData.list[0].dt_txt.split(" ")[0];
                            document.getElementById('currentDate').textContent = currentDate;
                            setCurrentWeatherCard();
                        })
                        .catch(error => {
                            alert(`An error occurred while fetching the weather details: ${error.message}`);
                        });
                })
                .catch(() => {
                    alert("An error occurred while fetching the city!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Permission was denied. Please reset location permissions and retry.");
            }
        }
    );
}

const setCurrentWeatherCard = () => {
    const weatherItem = currentWeatherData.list[0]; // Get the current weather item

// Check if the current weather item is available
    if (weatherItem) {
        const bottomBlock = document.querySelector(".bottom-block");
    
        // Update the HTML content of the bottom block
        bottomBlock.innerHTML = `
            <div class="bottom-details">
                <h4>Temperature: ${(weatherItem.main.temp).toFixed(2)}${currentTempUnit}</h4>
                <h4>Wind: ${weatherItem.wind.speed}${currentWindUnit}</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        `;
    }
};

switchElement.addEventListener("change", () => {
    if (switchElement.checked) {
        currentUnit = callImperial;
        currentTempUnit = fahrenheitSign;
    } else {
        currentUnit = callMetric;
        currentTempUnit = celsiusSign;
    }

    // Perform any necessary actions when the switch is toggled, such as updating weather data
    // ...
});

locationButton.addEventListener("click", getLocalCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

} else {
    // Code for the Node.js environment
    console.log("This code is running in a Node.js environment.");

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) { //Switched to current createWeatherCard if else - MH
            return " ";
        } else {
            return `<li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </li>`;
        }
        //Left old code in case wanted to change back
        /*if (index === 0) {
            return `<div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h4>${weatherItem.weather[0].description}</h4>
                    </div>`;
        } else {
            return `<li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </li>`;
        }*/
    }

    const getWeatherDetails = (cityName, lat, lon) => {
        
        const API_KEY = "6b75e1f27bd464fbc659aabb6312388f";
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        fetch(WEATHER_API_URL)
            .then(res => res.json())
            .then(data => {
                const uniqueForecastDays = [];

                const sevenDaysForecast = data.list.filter(forecast => {
                    const forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(forecastDate)) {
                        return uniqueForecastDays.push(forecastDate);
                    }
                });

                // Log the forecast data
                console.log(sevenDaysForecast);

                
            })
            .catch(() => {
                console.error("An error occurred while fetching the weather forecast!");
            });
    }

    const getCityCoordinates = () => {
        
        const API_KEY = "6b75e1f27bd464fbc659aabb6312388f";
        const cityName = "London"; // Provide a default city name for testing
        const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        fetch(GEOCODING_API_URL)
            .then(res => res.json())
            .then(data => {
                if (!data.length) return console.error(`No coordinates found for ${cityName}`);
                const { name, lat, lon } = data[0];
                getWeatherDetails(name, lat, lon);
            })
            .catch(() => {
                console.error("An error occurred while fetching the coordinates!");
            });
    }

    module.exports = {
        createWeatherCard,
        getWeatherDetails,
        getCityCoordinates,
        API_KEY: "6b75e1f27bd464fbc659aabb6312388f", // Export API_KEY for testing in Node.js
    };
}
