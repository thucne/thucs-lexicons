import { afterEach, describe, expect, it, vi } from 'vitest';

import { debounce } from '@/utils/debounce';

describe('debounce', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('delays callback execution until the timeout elapses', () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        const debounced = debounce(callback, 100);

        debounced();
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(99);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('cancels a pending callback', () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        const debounced = debounce(callback, 100);

        debounced();
        debounced.cancel();
        vi.advanceTimersByTime(100);

        expect(callback).not.toHaveBeenCalled();
    });
});
