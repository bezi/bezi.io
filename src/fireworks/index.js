// @flow
import FireworkEngine from "./FireworkEngine";

import random from "./random";

// Minimum number of ticks per manual firework launch.
const TICKS_PER_FIREWORK_MIN = 5;
// Minimum number of ticks between each automatic firework launch.
const TICKS_PER_FIREWORK_AUTOMATED_MIN = 10;
// Maximum number of ticks between each automatic firework launch.
const TICKS_PER_FIREWORK_AUTOMATED_MAX = 50;

const maybeCanvas = document.getElementById("fireworks");
if (!(maybeCanvas instanceof HTMLCanvasElement)) {
  throw new Error("No #fireworks canvas.");
}

const canvas: HTMLCanvasElement = maybeCanvas;

// Set canvas dimensions.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the context, 2d in this case.
const context = canvas.getContext("2d");
const fireworkEngine = new FireworkEngine(context);

let mouseX, mouseY;
let isMouseDown = false;

// Initial hue.
let ticksSinceFireworkAutomated = 0;
let ticksSinceFirework = 0;

// Track current mouse position within canvas.
canvas.addEventListener("mousemove", (e: MouseEvent) => {
  mouseX = e.pageX - canvas.offsetLeft;
  mouseY = e.pageY - canvas.offsetTop;
});

// Track when mouse is pressed.
canvas.addEventListener("mousedown", (e: MouseEvent) => {
  e.preventDefault();
  isMouseDown = true;
});

// Track when mouse is released.
canvas.addEventListener("mouseup", (e: MouseEvent) => {
  e.preventDefault();
  isMouseDown = false;
});

// Launch fireworks automatically.
function launchAutomatedFirework() {
  const FIREWORK_OFFSET = 150;
  // Determine if ticks since last automated launch is greater than random min/max values.
  if (
    ticksSinceFireworkAutomated >=
    random(TICKS_PER_FIREWORK_AUTOMATED_MIN, TICKS_PER_FIREWORK_AUTOMATED_MAX)
  ) {
    // Check if mouse is not currently clicked.
    if (!isMouseDown) {
      // Set start position to bottom center.
      let startY = canvas.height;
      // Set end position to random position, somewhere in the top half of screen.
      let endX = random(0, canvas.width);
      let endY = random(FIREWORK_OFFSET, canvas.height / 2);
      // Create new firework and add to collection.
      fireworkEngine.addFirework(endX, startY, endX, endY);
      // Reset tick counter.
      ticksSinceFireworkAutomated = 0;
    }
  } else {
    // Increment counter.
    ticksSinceFireworkAutomated++;
  }
}

// Launch fireworks manually, if mouse is pressed.
function launchManualFirework() {
  if (ticksSinceFirework >= TICKS_PER_FIREWORK_MIN) {
    // Check if mouse is down.
    if (isMouseDown) {
      // Set start position to bottom center.
      let startY = canvas.height;
      // Set end position to current mouse position.
      let endX = mouseX;
      let endY = mouseY;
      // Create new firework and add to collection.
      fireworkEngine.addFirework(endX, startY, endX, endY);
      // Reset tick counter.
      ticksSinceFirework = 0;
    }
  } else {
    ticksSinceFirework++;
  }
}

function launchTitleFireworks() {
  const FIREWORK_OFFSET = 150;
  const BOX_WIDTH = 600;
  const BOX_HEIGHT = 500;

  const xMin = (canvas.width - BOX_WIDTH) / 2;
  const xMax = (canvas.width + BOX_WIDTH) / 2;

  const yMin = (canvas.height - BOX_HEIGHT) / 2;
  const yMax = (canvas.height + BOX_HEIGHT) / 2;

  for (let startX = 0; startX < canvas.width; startX += 2 * FIREWORK_OFFSET) {
    for (let i = 0; i < 3; ++i) {
      let endX = random(xMin, xMax);
      let endY = random(yMin, yMax);
      // Create new firework and add to collection.
      fireworkEngine.addFirework(startX, canvas.height, endX, endY, 1000);
    }
  }
}

function render() {
  launchAutomatedFirework();
  launchManualFirework();

  window.requestAnimationFrame(render);
}

setTimeout(render, 2000);

launchTitleFireworks();
