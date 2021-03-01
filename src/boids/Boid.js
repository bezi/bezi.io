import interpolate from './interpolate';
import fillPathAtPoint, {BoidPath} from './fillPathAtPoint';

export default class Boid {
  constructor(x, y, screen) {
    const state = {
      x,
      y,
      theta: clampedRandom(0, Math.PI * 2),
    };

    this.prevState = state;
    this.nextState = state;

    this.color = `rgb(145, 150, ${Math.floor(clampedRandom(150, 255))})`;
    this.screen = screen;
  }

  render(context, alpha) {
    const {x, y, theta} = interpolate(this.prevState, this.nextState, alpha);

    fillPathAtPoint({
      context,
      path: BoidPath,
      color: this.color,
      x: clampToScreen(x, this.screen.width),
      y: clampToScreen(y, this.screen.height),
      theta,
    });
  }

  iterate(time_ms) {
    let {x, y, theta} = this.nextState;

    const speed_pixels_per_second = 300;
    const movement = (speed_pixels_per_second * time_ms) / 1000.0;

    x += movement * Math.cos(theta);
    y += movement * Math.sin(theta);

    this.prevState = this.nextState;
    this.nextState = {x, y, theta};
  }
}

function clampedRandom(min, max) {
  return min + Math.random() * (max - min);
}

function clampToScreen(coordinate, limit) {
  return ((coordinate % limit) + limit) % limit;
}
