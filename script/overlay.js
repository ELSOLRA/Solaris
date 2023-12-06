/* Manages the display of information when a planet is clicked. Makes it easier to manage and update the 
overlay functionality independently. Cleaner and more maintainable structure */

import { createStars } from './stars.js';
import { fetchData, getApiKey, apiUrl } from './api.js';
import { solarSystem } from './planets.js'

const descriptionContainer = document.querySelector('.planet-description');
const planetColors = {
    planet0: '255, 209, 41',
    planet1: '136, 136, 136',
    planet2: '231, 205, 205',
    planet3: '66, 142, 212',
    planet4: '239, 95, 95',
    planet5: '226, 148, 104',
    planet6: '199, 170, 114',
    planet7: '201, 212, 241',
    planet8: '122, 145, 167'
  };
  let cachedData = {};
  let isDataFetched = false;

//-------- function to show overlay with planet colour, and hide solarSystem layer 
// Updates the overlay content based on the clicked planet

async function openOverlay(planetId) {

    console.log('Planet:', planetId );
    
    const overlay = document.getElementById('overlay');
    const sun = document.getElementById('overlay-sun');
    const stars = document.querySelectorAll('.star');
  
    const planetColorByID = planetId.toLowerCase();
    const planetColor = planetColors[planetColorByID];
    
    console.log('Planet color name:', planetColorByID, 'Planet color:', planetColor);
    
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
    
  
    console.log('Planet:', planetId);
    console.log('Clicked planet:', planetId);
    console.log('Cached data:', cachedData);
    console.log('Bodies array:', cachedData.bodies);
  
    
    const planetInfo = cachedData.bodies.find(body => `planet${body.id}` === planetId);
  
    
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

//-------- Function to creat close button on overlay and add event listener

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

//-------- Function for creating description element 
// Creates and appends HTML elements with information about the clicked planet

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
  
    const rangeContainer = document.createElement('section');
    rangeContainer.classList.add ('planet-info__rangeContainer');
    const circumferenceElement = document.createElement('p');
    circumferenceElement.innerHTML = `<span class="planet-info__titles">OMKRETS</span><br>${formatNumber(circumference)} km`;
    circumferenceElement.classList.add('planet-info');
  
    const distanceElement = document.createElement('p');
    distanceElement.innerHTML = `<span class="planet-info__titles">KM FRÅN SOLEN</span><br>${formatNumber(distance)} km`;
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
  
//-------- Function to format a large number 
// Adds spaces as thousand separators

    function formatNumber(number) {   
// here d{3} are groups of three digits and ?!\d ensures that not followed by another digit
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); 
    }
} 

export { createStars, openOverlay, closeButton, updatePlanetDescription };