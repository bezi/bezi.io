import Boid from './Boid';

const separation = 100;
const padding = 50;

export default function generateBoids(width, height) {
  const screen = {width, height};

  const xs = centeredPointDistribution({
    min: padding,
    max: width - padding,
    separation,
  });

  const ys = centeredPointDistribution({
    min: padding,
    max: height - padding,
    separation,
  });

  const boids = [];

  for (const x of xs) {
    for (const y of ys) {
      boids.push(new Boid(x, y, screen));
    }
  }

  return boids;
}

// Generate a set of points between min and max, with a fixed separation and
// evenly splitting the difference between the beginning and the end.
function centeredPointDistribution({min, max, separation}) {
  const padding = ((max - min) % separation) / 2;
  const points = [];

  for (let i = min + padding; i <= max - padding; i += separation) {
    points.push(i);
  }

  return points;
}
