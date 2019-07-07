export const mapValues = f => o =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));
