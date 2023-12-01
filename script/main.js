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
const descriptionContainer = document.querySelector('.planet-description');
const apiUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
const planetNameMap = {
  mercury: 'Merkurius',
  venus: 'Venus',
  earth: 'Jorden',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturnus',
  uranus: 'Uranus',
  neptune: 'Neptunus'
};
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

let isDataFetched = false;
let cachedData = {};



// Function to fetch API key from the server

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
async function createStars(parentElement) {
  const starTypes = [
    { type: 'star1', count: 15 },   //6x6
    { type: 'star2', count: 22 },   //3x3
    { type: 'star3', count: 12 },   //5.8x5.8
    { type: 'star4', count: 2 }     //3x2
  ];
  const numberOfStars = 51; 

  for (const { type, count } of starTypes) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = `star ${type}`;
      star.style.top = `${getRandom(0, window.innerHeight)}px`;
      star.style.left = `${getRandom(0, window.innerWidth)}px`;
      parentElement.append(star);
    }
  }
}



async function openOverlay(planet) {

  console.log('Planet:', planet);
  
  const overlay = document.getElementById('overlay');
  const sun = document.getElementById('overlay-sun');
  const stars = document.querySelectorAll('.star');

  const planetColorName = planet.toLowerCase();
  const planetColor = planetColors[planetColorName];
  
  console.log('Planet color name:', planetColorName, 'Planet color:', planetColor);
  
  sun.style.backgroundColor = `rgba(${planetColor}, 1)`;
  sun.style.boxShadow = `0 0 0 3.875rem rgba(${planetColor}, 0.1), 0 0 0 7.875rem rgba(${planetColor}, 0.06)`;
  

if (stars.length === 0) {
  await createStars(overlay);
}

solarSystem.style.display = 'none';
overlay.style.display = 'flex';

try {
  // Fetch the data only if it has not been fetched before
  if (!isDataFetched) {
    const apiKey = await getApiKey();
    const data = await fetchData(apiUrl, apiKey);
    cachedData = data;
    isDataFetched = true; //  the flag to true to avoid repeated fetching
  }
  

  console.log('Planet:', planet);
  console.log('Clicked planet:', planet);
  console.log('Cached data:', cachedData);
  console.log('Bodies array:', cachedData.bodies);

  
  const planetInfo = cachedData.bodies.find(body => body.name.toLowerCase() === planetNameMap[planet].toLowerCase());
  
 
  


  
  if (planetInfo) {
    
    console.log('Found planetInfo:', planetInfo);
     updatePlanetDescription(planetInfo);
  } else {
    console.error('Invalid planetInfo:', planetInfo);
  }
} catch (error) {
  console.error('Error fetching or processing data:', error.message);
}

closeButton();
}




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
 



function updatePlanetDescription(planetInfo) {

  if (!planetInfo) {
    console.error('Invalid planetInfo:', planetInfo);
    return;
  }
 
  descriptionContainer.textContent = '';
  const { name, latinName, desc, circumference, distance, temp, moons } = planetInfo;

  const nameElement = document.createElement('h1');
  nameElement.textContent = `${name}`;
  nameElement.classList.add('planet-description__title');

  const latinNameElement = document.createElement('h3');
  latinNameElement.textContent = `${latinName}`;
  latinNameElement.classList.add('planet-description__subtitle');

  const descElement = document.createElement('p');
  descElement.textContent = `${desc}`;
  descElement.classList.add('planet-info');

  const lineElement1 = document.createElement('hr');
  lineElement1.classList.add('separator');

  const circumferenceElement = document.createElement('p');
  circumferenceElement.textContent = `${circumference} km`;
  circumferenceElement.classList.add('planet-info');

  const distanceElement = document.createElement('p');
  distanceElement.textContent = `${distance} km`;
  distanceElement.classList.add('planet-info');

  // Creating separate elements for day and night temperatures
  const tempDayElement = document.createElement('p');
  tempDayElement.textContent = `${temp.day} °C`;
  tempDayElement.classList.add('planet-info');

  const tempNightElement = document.createElement('p');
  tempNightElement.textContent = `${temp.night} °C`;
  tempNightElement.classList.add('planet-info');

  const lineElement2 = document.createElement('hr');
  lineElement2.classList.add('separator');

  const moonsElement = document.createElement('p');
  if (moons.length > 0) {
    moonsElement.textContent = `${moons.join(', ')}`;
  } else {
    moonsElement.textContent = `Doesn't have any known moons`;
  }
  moonsElement.classList.add('planet-info');

  descriptionContainer.append(
    nameElement,
    latinNameElement,
    descElement,
    lineElement1,
    circumferenceElement,
    distanceElement,
    tempDayElement,
    tempNightElement,
    lineElement2,
    moonsElement
  );
} 


function displayNoResults() {
  searchedContent.innerHTML = "<p>No results found for the given search term.</p>";
}