import Vector2 from './Vector2';

// Simple linear interpolation
export default function interpolate(prev, next, alpha) {
  if (prev == null) {
    throw new Error('Cannot interpolate null.');
  }

  if (prev instanceof Vector2) {
    return new Vector2(
      interpolate(prev.x, next.x, alpha),
      interpolate(prev.y, next.y, alpha),
    );
  }

  if (Array.isArray(prev)) {
    return prev.map((value, idx) => interpolate(prev[idx], next[idx], alpha));
  }

  switch (typeof prev) {
    case 'number': {
      return prev + (next - prev) * alpha;
    }

    case 'object': {
      const interpolated = {};

      for (const key in prev) {
        interpolated[key] = interpolate(prev[key], next[key], alpha);
      }

      return interpolated;
    }

    default:
      throw new Error('Invalid interpolation: ', typeof prev);
  }
}
