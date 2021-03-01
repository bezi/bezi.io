import generateBoids from './generateBoids';

const canvas = document.getElementById('boids');
const context = canvas.getContext('2d');

function render({width, height, state, alpha}) {
  context.resetTransform();
  context.clearRect(0, 0, width, height);

  for (const boid of state.boids) {
    boid.render(context, alpha);
  }
}

const PHYSICS_ITERATION_DT = 100;
function iterate(state) {
  for (const boid of state.boids) {
    boid.iterate(PHYSICS_ITERATION_DT, state.boids);
  }
}

let requestID = null;

// Gaffer on Games' fixed time step algorithm, repurposed.
function main() {
  // Kill off any ongoing render.
  if (requestID != null) {
    window.cancelAnimationFrame(requestID);
  }

  // Set up canvases and canvas state.
  const width = (canvas.width = document.body.offsetWidth);
  const height = (canvas.height = document.body.offsetHeight);

  const state = initialState(width, height);
  // Start by running the simulation for a bit, it makes up for the initial
  // positions being exactly on grids.
  for (let i = 0; i < 10; ++i) {
    iterate(state);
  }

  let timeAccumulator = 0;
  let prevTime = Date.now();

  const nextFrame = () => {
    const currTime = Date.now();
    timeAccumulator += currTime - prevTime;
    prevTime = currTime;

    while (timeAccumulator >= PHYSICS_ITERATION_DT) {
      iterate(state);
      timeAccumulator -= PHYSICS_ITERATION_DT;
    }

    const alpha = timeAccumulator / PHYSICS_ITERATION_DT;

    render({width, height, state, alpha});

    requestID = window.requestAnimationFrame(nextFrame);
  };

  nextFrame();
}

function initialState(width, height) {
  return {
    boids: generateBoids(width, height),
  };
}

window.addEventListener('resize', main);

main();
