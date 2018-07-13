const fireworksCanvas = document.getElementById("fireworks");
const reflectionCanvas = document.getElementById("reflection");

// Set canvas dimensions.
reflectionCanvas.width = window.innerWidth;
reflectionCanvas.height = window.innerHeight;

const context = reflectionCanvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(0, 0, reflectionCanvas.width, reflectionCanvas.height);

function render() {
  context.clearRect(
    -reflectionCanvas.width,
    -reflectionCanvas.height,
    reflectionCanvas.width * 2,
    reflectionCanvas.height * 2
  );

  context.drawImage(
    fireworksCanvas,
    0,
    reflectionCanvas.height / 2,
    reflectionCanvas.width,
    reflectionCanvas.height / 2
  );

  window.requestAnimationFrame(render);
}

render();
