/**
 * Runs an async worker over all items with at most `limit` calls in flight.
 * The results keep the order of the input.
 * @template T, R
 * @param {T[]} items - Input items
 * @param {number} limit - Maximum number of concurrent worker calls
 * @param {(item: T, index: number) => Promise<R>} worker - Async worker
 * @returns {Promise<R[]>}
 */
export async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  const runWorker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index], index);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runWorker));
  return results;
}
