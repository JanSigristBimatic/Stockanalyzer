const DEFAULT_MAX_POINTS = 240;

export function reduceChartData(data, maxPoints = DEFAULT_MAX_POINTS) {
  if (!Array.isArray(data)) return [];
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  const reduced = data.filter((_, index) => index % step === 0);
  const last = data[data.length - 1];

  if (reduced[reduced.length - 1] !== last) {
    reduced.push(last);
  }

  return reduced;
}
