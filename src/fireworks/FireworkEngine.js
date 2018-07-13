// @flow
import Firework from "./Firework";
import Particle from "./Particle";

// Hue change per loop, used to rotate through different firework colors.
const INITIAL_HUE = Math.floor(Math.random() * 180);
const HUE_STEP_INCREASE = 0.5;

// Base particle count per firework.
const PARTICLE_COUNT = 100;

// Alpha level that canvas cleanup iteration removes existing trails.
const CANVAS_CLEANUP_ALPHA = 0.15;

type QueuedFirework = {
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  activationTime: number
};

export default class FireworkEngine {
  +queue: Array<QueuedFirework> = [];
  +context: CanvasRenderingContext2D;
  +fireworks: Array<Firework> = [];
  +particles: Array<Particle> = [];

  hue = INITIAL_HUE;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.render();
  }

  render = () => {
    // Clean up the canvas;
    this.context.globalCompositeOperation = "destination-out";
    this.context.fillStyle = `rgba(0, 0, 0, ${CANVAS_CLEANUP_ALPHA})`;
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.globalCompositeOperation = "lighter";

    this.hue += HUE_STEP_INCREASE;

    for (let i = this.fireworks.length - 1; i >= 0; --i) {
      this.fireworks[i].draw(this.hue);
      const isComplete = this.fireworks[i].update();

      if (isComplete) {
        this.addExplosion(this.fireworks[i].x, this.fireworks[i].y);

        // We traverse backwards, so we don't have to touch i :).
        this.fireworks.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; --i) {
      this.particles[i].draw();
      const isComplete = this.particles[i].update();

      if (isComplete) {
        this.particles.splice(i, 1);
      }
    }

    const now = Date.now();

    for (let i = this.queue.length - 1; i >= 0; --i) {
      const { startX, startY, endX, endY, activationTime } = this.queue[i];

      if (activationTime < now) {
        this.fireworks.push(
          new Firework(this.context, startX, startY, endX, endY)
        );
        this.queue.splice(i, 1);
      }
    }

    window.requestAnimationFrame(this.render);
  };

  addFirework(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    timeout: number = 0
  ) {
    const now = Date.now();

    const activationTime = now + timeout;

    this.queue.push({
      startX,
      startY,
      endX,
      endY,
      activationTime
    });
  }

  addExplosion(x: number, y: number) {
    let particleCount = PARTICLE_COUNT;
    while (particleCount--) {
      this.particles.push(new Particle(this.context, x, y, this.hue));
    }
  }
}
