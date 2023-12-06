/*  Manages the visual representation. Planets appearence in HTML in an organized way. Sun elements involves specific styling.
Allows easy addition of new features or adjustments. Module is dedicated to visual elements in the solar system, making the 
code more readable and maintainable. */


const solarSystem = document.querySelector('.solar-system');
const planetsContainer = document.querySelector('.planets');
const planetsWithRing = new Set(['saturnus']);

//-------- Function to create a planet element based on the provided data.

function createPlanetElement(planet) {
    const planetElement = document.createElement('article');
    planetElement.className = 'planet';
    planetElement.id = `planet${planet.id}`;
    planetsContainer.append(planetElement);
  
    // If the planet should have a ring, adding ring element
    if (planetsWithRing.has(planet.name.toLowerCase())) {
      const ringElement = document.createElement('div');
      ringElement.className = 'planet__ring';
      planetElement.append(ringElement);
    }
}

//-------- Function to create a sun element with ID and click event listener.

function createSunElement(planetId) {
    const sunContainer = document.createElement('section');
    sunContainer.className = 'sun-container';
  
    const sunElement = document.createElement('section');
    sunElement.className = 'sun';
    sunElement.id = planetId;
    sunElement.addEventListener('click', () => {
      openOverlay(planetId);
    });
    sunContainer.append(sunElement);
  
    solarSystem.append(sunContainer);
}

export { createPlanetElement, createSunElement, planetsWithRing, solarSystem };