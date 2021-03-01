export default class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static add(v1, v2) {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  static dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static fromAngle(angle) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }

  static angleBetween(v1, v2) {
    return Math.acos(Vector2.dot(v1, v2) / (v1.length() * v2.length()));
  }

  static projectedOnto(v, u) {
    const unit_u = u.clone().normalize();
    return unit_u.multiply(Vector2.dot(v, unit_u));
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  normalize() {
    const length = this.length();
    this.multiply(1 / length);
    return this;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
}
