import { describe, it, expect } from 'vitest';
import { mapWithConcurrency } from './async';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('mapWithConcurrency', () => {
  it('never runs more workers than the limit at the same time', async () => {
    let running = 0;
    let maxRunning = 0;

    await mapWithConcurrency([1, 2, 3, 4, 5, 6, 7], 3, async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await sleep(5);
      running--;
    });

    expect(maxRunning).toBe(3);
  });

  it('keeps the input order in the results', async () => {
    const results = await mapWithConcurrency([30, 10, 20], 2, async (delay) => {
      await sleep(delay);
      return delay * 2;
    });

    expect(results).toEqual([60, 20, 40]);
  });

  it('handles an empty list', async () => {
    expect(await mapWithConcurrency([], 4, async () => 1)).toEqual([]);
  });
});
