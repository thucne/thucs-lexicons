import { useRef } from 'react';

import { Meaning } from '@/types';
import { useIntersectionStatus } from '@/hooks/use-intersection-observer';

import Definition from './Definition';
import Thesaurus from '../Thesaurus';

type MeaningProps = {
    meaning: Meaning;
    index: number;
    hidePosLabel?: boolean;
};

const MEANING_IO_OPTIONS = { threshold: 0.5, unobserveOnIntersect: true } as const;

const MeaningComponent = ({ meaning, index, hidePosLabel = false }: MeaningProps) => {
    const meaningRef = useRef<HTMLDivElement>(null);
    const mergedAntonyms = [
        ...new Set([
            ...(meaning.antonyms ?? []),
            ...meaning.definitions.flatMap((definition) => definition.antonyms ?? [])
        ])
    ];
    const mergedSynonyms = [
        ...new Set([
            ...(meaning.synonyms ?? []),
            ...meaning.definitions.flatMap((definition) => definition.synonyms ?? [])
        ])
    ];

    const isIntersecting = useIntersectionStatus(meaningRef, MEANING_IO_OPTIONS);

    return (
        <div ref={meaningRef} className="grid gap-4">
            {!hidePosLabel && (
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    {meaning.partOfSpeech}
                </p>
            )}

            <ul className="my-0 list-none space-y-4 pl-0">
                {meaning.definitions.map((definition, definitionIndex) => (
                    <Definition
                        key={`${meaning.partOfSpeech}-definition-${definitionIndex}`}
                        definition={definition}
                        index={index + definitionIndex}
                    />
                ))}
            </ul>

            {isIntersecting && (
                <Thesaurus antonyms={mergedAntonyms} synonyms={mergedSynonyms} autoExpand={index === 0} />
            )}
        </div>
    );
};

export default MeaningComponent;
