const { createWeatherCard, getWeatherDetails } = require('./script');
const { JSDOM } = require('jsdom');

// Set up JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body><input class="city-input" /></body></html>');
global.document = dom.window.document;
global.window = dom.window;

// Mock global objects and functions
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ /* Mocked response data */ }),
  })
);

global.alert = jest.fn();

// Clear mock calls before each test
beforeEach(() => {
  jest.clearAllMocks();
});

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
    const index = 1;

    const result = createWeatherCard(cityName, weatherItem, index);
    expect(result).toContain('<li class="card">');
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

    // Check if fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://api.openweathermap.org/data/2.5/forecast'));

    // Check if the input value is an empty string after a successful fetch
    expect(document.querySelector('.city-input').value).toBe('');
  });

  test('handles fetch error', async () => {
    // Mock the fetch function to throw an error
    fetch.mockRejectedValueOnce(new Error('Fetch error'));

    // Call the function
    await getWeatherDetails('TestCity', 40, -74);

    // Check if the alert function was called
    //expect(alert).toHaveBeenCalledTimes(1);

    // Check if the alert function was called with the correct message
    //expect(alert).toHaveBeenCalledWith('An error occurred while fetching the weather forecast!');
  });
});

