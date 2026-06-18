'use client';
import { useEffect, useState } from 'react';
import { debounce, type DebouncedFunc } from 'lodash';

type HoverOptions = {
    delay?: number;
    delayOnLeave?: boolean;
    filterClassName?: string;
    rootElement?: HTMLElement;
};

type ListenerParams = {
    eventName: string;
    callback: (e: Event) => void;
    element?: HTMLElement | Document;
    elementSelector?: string;
    dependencies?: unknown[];
};

const cancelDebounced = (fn: DebouncedFunc<(...args: never[]) => void> | ((...args: never[]) => void)) => {
    if ('cancel' in fn && typeof fn.cancel === 'function') {
        fn.cancel();
    }
};

export const useHoveredText = (options: HoverOptions): [string | null, HTMLElement | null] => {
    const [hoveredText, setHoveredText] = useState<string | null>('');
    const [hoveredTextElement, setHoveredTextElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const onMouseEnter = (e: MouseEvent) => {
            if (options.filterClassName && !(e.target as HTMLElement).classList.contains(options.filterClassName)) {
                return;
            }
            const target = e.target as HTMLElement;
            setHoveredText(target.innerText);
            setHoveredTextElement(target);
        };

        const onMouseLeave = () => {
            setHoveredText('');
            setHoveredTextElement(null);
        };

        const enterFunc: DebouncedFunc<(e: MouseEvent) => void> | ((e: MouseEvent) => void) = options.delay
            ? debounce(onMouseEnter, options.delay)
            : onMouseEnter;
        const leaveFunc: DebouncedFunc<() => void> | (() => void) =
            options.delayOnLeave && options.delay ? debounce(onMouseLeave, options.delay) : onMouseLeave;

        document.addEventListener('mouseover', enterFunc);
        document.addEventListener('mouseout', leaveFunc);

        return () => {
            document.removeEventListener('mouseover', enterFunc);
            document.removeEventListener('mouseout', leaveFunc);
            cancelDebounced(enterFunc);
            cancelDebounced(leaveFunc);
        };
    }, [options]);

    return [hoveredText, hoveredTextElement] as const;
};

export const useOnHoveredText = (
    options: HoverOptions
): [string | null, HTMLElement | null, (element: HTMLElement | null) => void] => {
    const { delay, filterClassName } = options;
    const [hoveredTextElement, setHoveredTextElement] = useState<HTMLElement | null>(null);
    const hoveredText = hoveredTextElement?.innerText || null;

    useEffect(() => {
        const onMouseEnter = (e: MouseEvent) => {
            if (filterClassName && !(e.target as HTMLElement).classList.contains(filterClassName)) {
                return;
            }
            const target = e.target as HTMLElement;
            setHoveredTextElement(target);
        };

        const enterFunc: DebouncedFunc<(e: MouseEvent) => void> | ((e: MouseEvent) => void) = delay
            ? debounce(onMouseEnter, delay)
            : onMouseEnter;

        document.addEventListener('mouseover', enterFunc);

        return () => {
            document.removeEventListener('mouseover', enterFunc);
            cancelDebounced(enterFunc);
        };
    }, [delay, filterClassName]);

    return [hoveredText, hoveredTextElement, setHoveredTextElement] as const;
};

export const useListener = ({ eventName, callback, dependencies, element, elementSelector }: ListenerParams) => {
    const [el, setElement] = useState<HTMLElement | Document | null>(null);

    useEffect(() => {
        if (elementSelector) {
            setElement(document.querySelector(elementSelector) as HTMLElement);
        } else {
            setElement(element || document);
        }
    }, [element, elementSelector, dependencies]);

    useEffect(() => {
        el?.addEventListener(eventName, callback);

        return () => {
            el?.removeEventListener(eventName, callback);
        };
    }, [eventName, callback, el]);
};
