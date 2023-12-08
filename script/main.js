// Dividing tasks to modules for clarity and logical organization. Each part has a clear role, making it easier to manage.
/* main.js module serves as the central hub, coordinating the initialization, as the backstage manager.  It manages the flow,
 fetching data, and creating planets and stars*/

import { fetchData, getApiKey, apiUrl } from './api.js';
import { createPlanetElement, createSunElement } from './planets.js'
import { openOverlay } from './overlay.js'

// const { createPlanetElement, createSunElement } = require('./planets')  // node


let cachedData = {};

//-------- Initialization function for solar system
/* Fetches an API key, retrieves and caches data if not already cached,
dynamically creates planet, star elements. Event listeners are added to each planet.*/

(async function init() {
  try {
// Fetch the API key
    const apiKey = await getApiKey();
    let data = cachedData;

// fetch data, if the data is not cached
    if (Object.keys(data).length === 0) {

      data = await fetchData(apiUrl, apiKey);
      cachedData = data;
    }

    const planets = data.bodies;
// Flag to check if sun element has been created
    let sunCreated = false;
// Check if where is type: 'star' in data    
    const isStar = data.bodies.some(planet => planet.type === 'star'); 
// Creating planet elements dynamically
    planets.forEach(planet => {
      if (planet.type === 'star' && !sunCreated) {
        sunCreated = true;
        createSunElement(`planet${planet.id}`);
      } else if (planet.type !== 'star' && planet.type === 'planet' ) {
      
      createPlanetElement(planet)
  }
});

// event listeners to each planet
    planets.forEach(planet => {
      const planetElement = document.getElementById(`planet${planet.id}`);
      if (planetElement) {
        planetElement.addEventListener('click', () => {
          openOverlay(`planet${planet.id}`);
        });
      }
    });

    if (!isStar) {

      console.log('No star in the API !');
    }

  } catch (error) {
    console.error('Error initializing:', error.message);
  }
})();   // <----   init function is invoked immediately!


