export default function fillPathAtPoint({context, path, color, x, y, theta}) {
  context.resetTransform();
  context.translate(x, y);
  context.rotate(theta);

  context.fillStyle = color;
  context.fill(path);
}

export const BoidPath = makeBoidPath({length: 20});

function makeBoidPath({length}) {
  const nose_angle = 0.3587; // hand_tuned
  const width = length * Math.tan(nose_angle);

  const boidPath = new Path2D();

  boidPath.moveTo(length / 2, 0);
  boidPath.lineTo(-length / 2, width);
  boidPath.lineTo((-3 * length) / 8, 0);
  boidPath.lineTo(-length / 2, -width);
  boidPath.closePath();

  return boidPath;
}
