'use client';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

type HoverOptions = {
    delay?: number;
    delayOnLeave?: boolean;
    filterClassName?: string;
    rootElement?: HTMLElement;
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
): [string | null, HTMLElement | null, (text: string | null) => void, (element: HTMLElement | null) => void] => {
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

        const enterFunc = options.delay ? debounce(onMouseEnter, options.delay) : onMouseEnter;

        document.addEventListener('mouseover', enterFunc);

        return () => {
            document.removeEventListener('mouseover', onMouseEnter);
        };
    }, [options]);

    return [hoveredText, hoveredTextElement, setHoveredText, setHoveredTextElement] as const;
};
