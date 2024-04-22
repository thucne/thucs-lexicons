'use client';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

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
    dependencies?: any[];
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

        const enterFunc = options.delay ? debounce(onMouseEnter, options.delay) : onMouseEnter;
        const leaveFunc = options.delayOnLeave && options.delay ? debounce(onMouseLeave, options.delay) : onMouseLeave;

        document.addEventListener('mouseover', enterFunc);
        document.addEventListener('mouseout', leaveFunc);

        return () => {
            document.removeEventListener('mouseover', onMouseEnter);
            document.removeEventListener('mouseout', onMouseLeave);
        };
    }, [options]);

    return [hoveredText, hoveredTextElement] as const;
};

export const useOnHoveredText = (
    options: HoverOptions
): [string | null, HTMLElement | null, (element: HTMLElement | null) => void] => {
    const [hoveredTextElement, setHoveredTextElement] = useState<HTMLElement | null>(null);
    const hoveredText = hoveredTextElement?.innerText || null;

    useEffect(() => {
        const onMouseEnter = (e: MouseEvent) => {
            if (options.filterClassName && !(e.target as HTMLElement).classList.contains(options.filterClassName)) {
                return;
            }
            const target = e.target as HTMLElement;
            setHoveredTextElement(target);
        };

        const enterFunc = options.delay ? debounce(onMouseEnter, options.delay) : onMouseEnter;

        document.addEventListener('mouseover', enterFunc);

        return () => {
            document.removeEventListener('mouseover', onMouseEnter);
        };
    }, [options]);

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
