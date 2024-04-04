'use client';
import { useState, useEffect } from 'react';

export const useIntersectionStatus = (
    ref: React.RefObject<HTMLElement>,
    options: IntersectionObserverInit & {
        unobserveOnIntersect?: boolean;
    }
): boolean => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const observer = new IntersectionObserver(([entry], observer) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                if (options.unobserveOnIntersect) {
                    observer.unobserve(entry.target);
                }
            }
        }, options);

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [ref, options]);

    return isIntersecting;
};
