// @flow
import random from "./random";

// Minimum particle brightness.
const PARTICLE_BRIGHTNESS_MIN = 50;
// Maximum particle brightness.
const PARTICLE_BRIGHTNESS_MAX = 80;
// Minimum particle decay rate.
const PARTICLE_DECAY_MIN = 0.015;
// Maximum particle decay rate.
const PARTICLE_DECAY_MAX = 0.03;
// Base particle friction.
// Slows the speed of particles over time.
const PARTICLE_FRICTION = 0.95;
// Base particle gravity.
// How quickly particles move toward a downward trajectory.
const PARTICLE_GRAVITY = 0.7;
// Variance in particle coloration.
const PARTICLE_HUE_VARIANCE = 20;
// Base particle transparency.
const PARTICLE_TRANSPARENCY = 1;
// Minimum particle speed.
const PARTICLE_SPEED_MIN = 1;
// Maximum particle speed.
const PARTICLE_SPEED_MAX = 10;

// Base length of explosion particle trails.
const PARTICLE_TRAIL_LENGTH = 5;

export default class Particle {
  x: number;
  y: number;
  angle: number = random(0, Math.PI * 2);
  transparency: number = PARTICLE_TRANSPARENCY;

  +hue: number;
  +context: CanvasRenderingContext2D;

  +brightness: number = random(
    PARTICLE_BRIGHTNESS_MIN,
    PARTICLE_BRIGHTNESS_MAX
  );
  +decay: number = random(PARTICLE_DECAY_MIN, PARTICLE_DECAY_MAX);
  +speed: number = random(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX);

  +trail: Array<[number, number]>;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    hue: number
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.hue = random(hue - PARTICLE_HUE_VARIANCE, hue + PARTICLE_HUE_VARIANCE);

    this.trail = [];

    for (let i = 0; i < PARTICLE_TRAIL_LENGTH; ++i) {
      this.trail.push([this.x, this.y]);
    }
  }

  update() {
    this.trail.pop();
    this.trail.unshift([this.x, this.y]);

    this.speed *= PARTICLE_FRICTION;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + PARTICLE_GRAVITY;

    this.transparency -= this.decay;
    return this.transparency < 0;
  }

  draw() {
    const last = this.trail[this.trail.length - 1];
    const trailEndX = last[0];
    const trailEndY = last[1];

    this.context.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${
      this.transparency
    })`;

    this.context.beginPath();
    this.context.moveTo(trailEndX, trailEndY);
    this.context.lineTo(this.x, this.y);
    this.context.stroke();
  }
}
