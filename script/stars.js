// A clean structure for handling star-related features, allowing for easy modification and extension without affecting other parts.

//-------- Function to get random number

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

//-------- Function to create different stars and set their positions

async function createStars(container) {
// Define types and counts of different stars
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
      container.append(star);
    }
  }
}

export { getRandom, createStars };