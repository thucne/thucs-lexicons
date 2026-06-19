export type Debounced<T extends (...args: never[]) => void> = ((...args: Parameters<T>) => void) & {
    cancel: () => void;
};

export const debounce = <T extends (...args: never[]) => void>(callback: T, delay: number): Debounced<T> => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = ((...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = null;
            callback(...args);
        }, delay);
    }) as Debounced<T>;

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
};
