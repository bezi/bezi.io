// Simple linear interpolation
export default function interpolate(prev, next, alpha) {
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
