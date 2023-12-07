/* Fetches API key from the server. These functions make more clarity API-handling logic. Isolates server communication 
logic from other parts. Keeps secret key separate for easy handling. Manages data-fetching tasks, and we keep data separate. */

const apiUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
let cachedData = {};

//-------- Function to get an API key from the server
// Sends a POST request to the specified API endpoint and returns API key

async function getApiKey() {
  
  try {
    const response = await fetch(`${apiUrl}/keys`, {
      method: 'POST',
      headers: {
        'x-zocom': ''
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.key;

  } catch (error) {
      console.error('Error fetching key:', error.message);
      throw error;
    }
}

//-------- Function to fetch data from the server and cache it
// Sends a request to the API endpoint using the API key

async function fetchData(apiUrl, apiKey) {
  
  try {
  
    if (Object.keys(cachedData).length !== 0) {
      console.log('Using cached data:', cachedData);
      return cachedData;
    }
  
    const response = await fetch(`${apiUrl}/bodies`, {
      headers: {
        'x-zocom': `${apiKey}`,
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const result = await response.json();
    cachedData = result;
    return result;
  } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
}

export { fetchData, getApiKey, apiUrl, cachedData };