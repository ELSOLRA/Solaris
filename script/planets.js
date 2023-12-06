const solarSystem = document.querySelector('.solar-system');
const planetsContainer = document.querySelector('.planets');
const planetsWithRing = new Set(['saturnus']);

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