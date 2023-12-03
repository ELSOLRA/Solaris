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
const planetsContainer = document.querySelector('.planets');
const descriptionContainer = document.querySelector('.planet-description');
const apiUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
/* const planetNameMap = {
  mercury: 'Merkurius',
  venus: 'Venus',
  earth: 'Jorden',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturnus',
  uranus: 'Uranus',
  neptune: 'Neptunus'
}; */
const planetColors = {
  merkurius: '136, 136, 136',
  venus: '231, 205, 205',
  jorden: '66, 142, 212',
  mars: '239, 95, 95',
  jupiter: '226, 148, 104',
  saturnus: '199, 170, 114',
  uranus: '201, 212, 241',
  neptunus: '122, 145, 167'
};

let isDataFetched = false;
let cachedData = {};



// Function to fetch API key from the server

(async function init() {
  try {
    const apiKey = await getApiKey();
    let data = cachedData;

// fetch data, if the data is not cached

    if (Object.keys(data).length === 0) {
      data = await fetchData(apiUrl, apiKey);
      cachedData = data;
    }

    const planets = data.bodies;
    console.log(data.bodies);
    let isStar = false;
    const planetsWithRing = new Set(['saturnus']);

    for (const planet of planets) {
      if (planet.type === 'star') {
        isStar = true;
        const sunContainer = document.createElement('section');
        sunContainer.className = 'sun-container';

        const sunElement = document.createElement('section');
        sunElement.className = 'sun';
        sunElement.id = planet.name.toLowerCase(); 
        sunContainer.append(sunElement);

        solarSystem.append(sunContainer);
        break; // iterating stop if a star is found
      }
    }

// Creating planet elements dynamically

    planets.forEach(planet => {
      const planetElement = document.createElement('article');
      planetElement.className = 'planet';
      planetElement.id = planet.name.toLowerCase(); //  planet name as the ID
      planetsContainer.append(planetElement);

// If the planet should have a ring, adding ring element

      if (planetsWithRing.has(planet.name.toLowerCase())) {
        const ringElement = document.createElement('div');
        ringElement.className = 'planet__ring';
        planetElement.append(ringElement);
      }
    });

// event listeners to each planet

    planets.forEach(planet => {
      const planetElement = document.getElementById(planet.name.toLowerCase());
      if (planetElement) {
        planetElement.addEventListener('click', () => {
          openOverlay(planet.name.toLowerCase());
        });
      }
    });

    if (!isStar) {

      console.log('No star in the API !');
    }

  } catch (error) {
    console.error('Error initializing:', error.message);
  }
})();   // <---   init function is invoked immediately!


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

// Function to create different stars and set their positions

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

// function to show overlay with planet colour, and hide solarSystem layer 

async function openOverlay(planetName) {

  console.log('Planet:', planetName);
  
  const overlay = document.getElementById('overlay');
  const sun = document.getElementById('overlay-sun');
  const stars = document.querySelectorAll('.star');

  const planetColorName = planetName.toLowerCase();
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
  

  console.log('Planet:', planetName);
  console.log('Clicked planet:', planetName);
  console.log('Cached data:', cachedData);
  console.log('Bodies array:', cachedData.bodies);

  
  const planetInfo = cachedData.bodies.find(body => body.name.toLowerCase() === planetName.toLowerCase());

  
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


// function to creat close button and add event listener

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
 

// function for creating description element and taking object keys with their data/values from cachedData  

function updatePlanetDescription(planetInfo) {

  if (!planetInfo) {
    console.error('Invalid planetInfo:', planetInfo);
    return;
  }
 
  // descriptionContainer.textContent = '';
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

  const rangeContainer = document.createElement('section');
  rangeContainer.classList.add ('planet-info__rangeContainer');
  const circumferenceElement = document.createElement('p');
  circumferenceElement.innerHTML = `<span class="planet-info__titles">OMKRETS</span><br>${circumference} km`;
  circumferenceElement.classList.add('planet-info');

  const distanceElement = document.createElement('p');
  distanceElement.innerHTML = `<span class="planet-info__titles">KM FRÅN SOLEN</span><br>${distance} km`;
  distanceElement.classList.add('planet-info');
  rangeContainer.append(circumferenceElement, distanceElement);

  // Creating separate elements for day and night temperatures
  const temperaturesContainer = document.createElement('section');
  temperaturesContainer.classList.add ('planet-info__temperaturesContainer');
  const tempDayElement = document.createElement('p');
  tempDayElement.innerHTML = `<span class="planet-info__titles">MAX TEMPERATUR</span><br>${temp.day} C`;
  tempDayElement.classList.add('planet-info');

  const tempNightElement = document.createElement('p');
  tempNightElement.innerHTML = `<span class="planet-info__titles">MIN TEMPERATUR</span><br>${temp.night} C`;
  tempNightElement.classList.add('planet-info');
  temperaturesContainer.append(tempDayElement, tempNightElement);

  const lineElement2 = document.createElement('hr');
  lineElement2.classList.add('separator');

  const moonsElement = document.createElement('p');
  if (moons.length > 0) {
    moonsElement.innerHTML = `<span class="planet-info__titles">MÅNAR</span><br>${moons.join(', ')}`;
  } else {
    moonsElement.textContent = `Doesn't have any known moons`;
  }
  moonsElement.classList.add('planet-info');

  descriptionContainer.textContent = '';

  descriptionContainer.append(
    nameElement,
    latinNameElement,
    descElement,
    lineElement1,
    rangeContainer,
    temperaturesContainer,
    lineElement2,
    moonsElement
  );
} 


function displayNoResults() {
  searchedContent.innerHTML = "<p>No results found for the given search term.</p>";
}