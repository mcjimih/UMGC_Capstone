/*
Author: Matthew Hendrix
Purpose: Pull data from database via JS
*/
const axios = require('axios');

const apiUrl = 'https://up4ch9eh3c.execute-api.us-east-2.amazonaws.com/Testing_Stage/test-to-pull-data';

axios.get(apiUrl)
  .then(response => {
    // Check if the response status is OK (2xx)
    if (response.status === 200) {
      const data = JSON.stringify(response.data, null, 2);
      console.log('API Response:', data);
    } else {
      console.error('Error:', response.status, response.statusText);
    }
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching API:', error.message);
  });
