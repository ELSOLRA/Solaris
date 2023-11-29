/* fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
  method: 'POST',
  headers: {
    'x-zocom': ''
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
  console.error('Error:', error);
}); */

const apiUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';

let cachedData = {};



// Function to fetch API key from the server

async function getApiKey() {
  
  try {
    const response = await fetch(`${apiUrl}/keys`, {
      method: 'POST',
      headers: {
        'x-zocom': ''
      },
/*       body: JSON.stringify({ username, password,}) */ // if needed to send password and user name with request, JSON.stringify is used to format the data in a way that the server expects.
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

// Function to fetch data from the server and cache it

async function fetchData(apiUrl, key) {
  try {

    if (Object.keys(cachedData).length !== 0) {
      console.log('Using cached data:', cachedData);
      return cachedData;
    }

    const response = await fetch(`${apiUrl}/bodies`, {
      headers: {
        'x-zocom': `${key}`,
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

// Initializing getApikey and receiving fetchData
  
getApiKey()
.then(apiKey => {

  return fetchData(apiUrl, apiKey);       // fetchData function with the obtained API key 
})
.then(data => {
  console.log('Fetched data:', data);     // see fetch objects
})
.catch(error => {
  console.error('Main error:', error.message);
});



