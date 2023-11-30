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

const solarSystem = document.querySelector('.solar-system');
const apiUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';

let cachedData = {};
const planetColors = {
  mercury: '136, 136, 136',
  venus: '231, 205, 205',
  earth: '66, 142, 212',
  mars: '239, 95, 95',
  jupiter: '226, 148, 104',
  saturn: '199, 170, 114',
  uranus: '201, 212, 241',
  neptune: '122, 145, 167'
};



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


function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create stars and set their positions
function createStars(parentElement) {
  const numberOfStars = 51; 

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${getRandom(0, window.innerHeight)}px`;
    star.style.left = `${getRandom(0, window.innerWidth)}px`;
    parentElement.append(star);
  }
}

function openOverlay(planet) {
  
  const overlay = document.getElementById('overlay');
  const sun = document.getElementById('overlay-sun');
  

  const planetColor = planetColors[planet.toLowerCase()];
  
  sun.style.backgroundColor = `rgba(${planetColor}, 1)`;
  sun.style.boxShadow = `0 0 0 3.875rem rgba(${planetColor}, 0.1), 0 0 0 7.875rem rgba(${planetColor}, 0.06)`;

  const stars = document.querySelectorAll('.star');
if (stars.length === 0) {
  createStars(overlay);
}

solarSystem.style.display = 'none';
overlay.style.display = 'flex';

closeButton();
}

(function init() {
  // Attach click event listeners to each planet
  const planets = document.querySelectorAll('.planet');
  planets.forEach(planet => {
      planet.addEventListener('click', () => {
          const planetId = planet.id;
          openOverlay(planetId);
      });
  });
})();   // init function is invoked immediately!


function closeButton() {
  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.id = 'closeButton';
  document.getElementById('overlay').append(closeButton);

  closeButton.addEventListener('click', () => {
      const overlay = document.getElementById('overlay');
      overlay.style.display = 'none';
      solarSystem.style.display = 'flex';
      closeButton.remove(closeButton);

  });
}
 