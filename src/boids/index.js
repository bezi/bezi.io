const canvas = document.getElementById('boids');
const context = canvas.getContext('2d');

function render({width, height}) {}

let requestID = null;

function main() {
  if (requestID != null) {
    window.cancelAnimationFrame(requestID);
  }

  const width = (canvas.width = document.body.offsetWidth);
  const height = (canvas.height = document.body.offsetHeight);

  const nextFrame = () => {
    context.clearRect(0, 0, width, height);
    render({width, height});
    requestID = window.requestAnimationFrame(nextFrame);
  };

  nextFrame();
}

window.addEventListener('resize', main);

main();
