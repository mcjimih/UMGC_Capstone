// Check if the script is running in a browser environment
if (typeof window !== 'undefined') {
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".search-btn");
    const locationButton = document.querySelector(".location-btn");
    const currentWeatherDiv = document.querySelector(".current-weather");
    const weatherCardsDiv = document.querySelector(".weather-cards");

    // Use a placeholder value for API_KEY in the browser environment
    const API_KEY = "6b75e1f27bd464fbc659aabb6312388f"

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
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
        }
    }

    const getWeatherDetails = (cityName, lat, lon) => {
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

                // Clears old data
                cityInput.value = "";
                currentWeatherDiv.innerHTML = "";
                weatherCardsDiv.innerHTML = "";

                sevenDaysForecast.forEach((weatherItem, index) => {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                });
            })
            .catch(() => {
                alert("An error occurred while fetching the weather forecast!");
            });
    }

    const getCityCoordinates = () => {
        const cityName = cityInput.value.trim();
        if (!cityName) return;
        const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        fetch(GEOCODING_API_URL)
            .then(res => res.json())
            .then(data => {
                if (!data.length) return alert(`No coordinates found for ${cityName}`);
                const { name, lat, lon } = data[0];
                getWeatherDetails(name, lat, lon);
            })
            .catch(() => {
                alert("An error occurred while fetching the coordinates!");
            });
    }

    const getLocalCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

                fetch(REVERSE_GEOCODING_URL)
                    .then(res => res.json())
                    .then(data => {
                        const { name } = data[0];
                        getWeatherDetails(name, latitude, longitude);
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

    locationButton.addEventListener("click", getLocalCoordinates);
    searchButton.addEventListener("click", getCityCoordinates);
    cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
} else {
    // Code for the Node.js environment
    console.log("This code is running in a Node.js environment.");

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
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
        }
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
