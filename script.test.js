// Import the functions from script.js
const { createWeatherCard, getWeatherDetails, getCityCoordinates, getLocalCoordinates } = require('./script');

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ /* Mocked response data */ }),
  })
);

// Mock the alert function
global.alert = jest.fn();
describe('createWeatherCard', () => {
  test('creates weather card for index 0', () => {
    const cityName = 'TestCity';
    const weatherItem = {
      dt_txt: '2023-01-01',
      main: {
        temp: 300,
        humidity: 80,
      },
      wind: {
        speed: 5,
      },
      weather: [
        {
          icon: '01d',
          description: 'Clear sky',
        },
      ],
    };
    const index = 0;

    const result = createWeatherCard(cityName, weatherItem, index);
    expect(result).toContain('<div class="details">');
    expect(result).toContain('<div class="icon">');
  });

  test('creates weather card for index greater than 0', () => {
  });
});

describe('getWeatherDetails', () => {
  test('fetches weather details successfully', async () => {
    // Mock the fetch function to return a successful response
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ /* Mocked response data */ }),
    });

    // Call the function
    await getWeatherDetails('TestCity', 40, -74);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.openweathermap.org/data/2.5/forecast'));
    expect(cityInput.value).toBe('');
  });

  test('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    fetch.mockRejectedValueOnce(new Error('Fetch error'));

    // Call the function
    await getWeatherDetails('TestCity', 40, -74);
    expect(alert).toHaveBeenCalledWith('An error occurred while fetching the weather forecast!');
  });
});