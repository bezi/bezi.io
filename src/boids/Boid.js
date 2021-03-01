import interpolate from './interpolate';
import fillPathAtPoint, {BoidPath} from './fillPathAtPoint';
import Vector2 from './Vector2';

const SPEED_PX_PER_SECOND = 300;
const VISION_RADIUS = 100;
const VIEW_ANGLE = (5 * Math.PI) / 4;
const MAX_ACCELERATION_MAGNITUDE = 100;

export default class Boid {
  constructor(x, y, screen, angle = clampedRandom(0, Math.PI * 2)) {
    const state = {
      position: new Vector2(x, y),
      velocity: Vector2.fromAngle(angle).multiply(SPEED_PX_PER_SECOND),
    };
    this.prevState = state;
    this.nextState = state;

    this.color = `rgb(145, 150, ${Math.floor(clampedRandom(150, 255))})`;
    this.screen = screen;
  }

  render(context, alpha) {
    const {position, velocity} = interpolate(
      this.prevState,
      this.nextState,
      alpha,
    );

    fillPathAtPoint({
      context,
      path: BoidPath,
      color: this.color,
      position,
      theta: velocity.angle(),
    });
  }

  iterate(timeMs, boids) {
    this._teleportIfOffscreen();

    const {position, velocity} = this.nextState;

    const acceleration = this._flockingBehaviourAcceleration(boids);

    const newVelocity = Vector2.add(acceleration.multiply(timeMs), velocity)
      .normalize()
      .multiply(SPEED_PX_PER_SECOND);

    const newPosition = Vector2.add(
      position,
      newVelocity.clone().multiply(timeMs / 1000.0),
    );

    this.prevState = this.nextState;
    this.nextState = {
      position: newPosition,
      velocity: newVelocity,
    };
  }

  _flockingBehaviourAcceleration(boids) {
    const visibleBoids = this._visibleBoids(boids);
    const {position, velocity} = this.nextState;

    // The three principles of simulated flocking as described by Reynolds are:
    // 1. Collision Avoidance: Avoid collisions with nearby flockmates
    // 2. Velocity Matching: Attempt to match velocity with nearby flockmates
    // 3. Flock centering: Attempt to stay close to nearby flockmates
    const AVOIDANCE_WEIGHT = 1000;
    const VELOCITY_MATCHING_WEIGHT = 400;
    const FLOCK_CENTERING_WEIGHT = 100;

    // Collision Avoidance
    let netAvoidanceAcceleration = new Vector2(0, 0);
    for (const boid of visibleBoids) {
      const offset = Vector2.subtract(boid.nextState.position, position);
      const singleAvoidanceAcceleration = offset
        .clone()
        .normalize()
        .multiply(-1 / offset.length());

      netAvoidanceAcceleration = Vector2.add(
        netAvoidanceAcceleration,
        singleAvoidanceAcceleration,
      );
    }

    const netAcceleration = netAvoidanceAcceleration.multiply(AVOIDANCE_WEIGHT);

    if (netAcceleration.length() > MAX_ACCELERATION_MAGNITUDE) {
      netAcceleration.normalize().multiply(MAX_ACCELERATION_MAGNITUDE);
    }

    return netAcceleration;
  }

  _visibleBoids(boids) {
    const {position, velocity} = this.nextState;

    return boids.filter(boid => {
      const offset = Vector2.subtract(position, boid.nextState.position);

      if (offset.length() > VISION_RADIUS) {
        return false;
      }

      const angleToBoid = Vector2.angleBetween(velocity, offset);
      return angleToBoid < VIEW_ANGLE / 2;
    });
  }
  // If we're off the screen, start by teleporting to the other side of the
  // screen.  This isn't smooth, but should happen offscreen. This should only
  // be invoked in a iterate() call, since it breaks the prevState to nextState
  // interpolation.
  _teleportIfOffscreen() {
    const TELEPORT_MARGIN = 25;
    let {position} = this.nextState;
    const {width, height} = this.screen;

    if (position.x < -TELEPORT_MARGIN || width + TELEPORT_MARGIN < position.x) {
      position.x = width - position.x;
    }

    if (
      position.y < -TELEPORT_MARGIN ||
      height + TELEPORT_MARGIN < position.y
    ) {
      position.y = height - position.y;
    }
  }
}

function clampedRandom(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}
