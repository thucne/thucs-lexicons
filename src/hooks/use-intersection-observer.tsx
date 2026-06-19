'use client';
import { useState, useEffect } from 'react';

export const useIntersectionStatus = (
    ref: React.RefObject<HTMLElement | null>,
    options: IntersectionObserverInit & {
        unobserveOnIntersect?: boolean;
    }
): boolean => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const { root = null, rootMargin = '0px', threshold = 0, unobserveOnIntersect = false } = options;

    useEffect(() => {
        const element = ref.current;

        const observer = new IntersectionObserver(
            ([entry], observer) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    if (unobserveOnIntersect) {
                        observer.unobserve(entry.target);
                    }
                }
            },
            { root, rootMargin, threshold }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [ref, root, rootMargin, threshold, unobserveOnIntersect]);

    return isIntersecting;
};
