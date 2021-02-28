// @flow
import random from './random';

const FIREWORK_ACCELERATION = 1.05;

const FIREWORK_BRIGHTNESS_MIN = 50;
const FIREWORK_BRIGHTNESS_MAX = 70;

const FIREWORK_SPEED = 5;
const FIREWORK_TRAIL_LENGTH = 3;

function distanceSquared(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return dx * dx + dy * dy;
}

export default class Firework {
  x: number;
  y: number;
  speed: number = FIREWORK_SPEED;

  +startX: number;
  +startY: number;
  +targetDistanceSquared: number;

  +angle: number;
  +trail: Array<[number, number]>;
  +brightness: number = random(
    FIREWORK_BRIGHTNESS_MIN,
    FIREWORK_BRIGHTNESS_MAX,
  );

  +context: CanvasRenderingContext2D;

  constructor(
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) {
    this.context = context;
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.targetDistanceSquared = distanceSquared(startX, startY, endX, endY);

    this.trail = [];

    for (let i = 0; i < FIREWORK_TRAIL_LENGTH; ++i) {
      this.trail.push([this.x, this.y]);
    }

    this.angle = Math.atan2(endY - startY, endX - startX);
  }

  update() {
    this.trail.pop();
    this.trail.unshift([this.x, this.y]);

    this.speed *= FIREWORK_ACCELERATION;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    const traversedDistanceSquared = distanceSquared(
      this.x,
      this.y,
      this.startX,
      this.startY,
    );

    return traversedDistanceSquared > this.targetDistanceSquared;
  }

  draw(hue: number) {
    const last = this.trail[this.trail.length - 1];
    const trailEndX = last[0];
    const trailEndY = last[1];

    this.context.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;

    this.context.beginPath();
    this.context.moveTo(trailEndX, trailEndY);
    this.context.lineTo(this.x, this.y);
    this.context.stroke();
  }
}
