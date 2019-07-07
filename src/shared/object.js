export const mapValues = f => o =>
    Object.fromEntries(Object.entries(o).map(([k, v]) => [k, f(v)]));

export const arrayToObject = f => a => Object.fromEntries(a.map(e => [e, f(e)]))
