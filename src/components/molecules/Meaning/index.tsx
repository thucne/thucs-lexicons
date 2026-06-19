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

const MeaningComponent = ({ meaning, index, hidePosLabel = false }: MeaningProps) => {
    const meaningRef = useRef<HTMLDivElement>(null);

    const isIntersecting = useIntersectionStatus(meaningRef, { threshold: 0.5, unobserveOnIntersect: true });

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
                        isIntersecting={isIntersecting}
                    />
                ))}
            </ul>

            {isIntersecting && (
                <Thesaurus antonyms={meaning.antonyms} synonyms={meaning.synonyms} autoExpand={index === 0} />
            )}
        </div>
    );
};

export default MeaningComponent;
