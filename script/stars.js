function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Function to create stars and set their positions
  function createStars(parentElement) {
    const numberOfStars = 51; 

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${getRandom(0, parentElement.innerHeight)}px`;
      star.style.left = `${getRandom(0, parentElement.innerWidth)}px`;
      parentElement.append(star);
    }
  }

  function openOverlay(planet) {
    const solarSystem = document.getElementById('solar-system');
    const overlay = document.getElementById('overlay');
    const sun = document.getElementById('overlay-sun');

    const planetColor = planetColors[planet.toLowerCase()];
    sun.style.backgroundColor = planetColor;

    const stars = document.querySelectorAll('.star');
  if (stars.length === 0) {
    createStars(overlay);
  }
  solarSystem.style.display = 'none';
  overlay.style.display = 'flex';

  closeButton();
}
  
function init() {
    // Attach click event listeners to each planet
    const planets = document.querySelectorAll('.planet');
    planets.forEach(planet => {
      planet.addEventListener('click', () => {
        const planetId = planet.id;
        openOverlay(planetId)
    });
});
}();   // init function is invoked immediately


function closeButton() {
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.id = 'closeButton';
    document.getElementById('overlay').append(closeButton);

    closeButton.addEventListener('click', () => {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
    });
}