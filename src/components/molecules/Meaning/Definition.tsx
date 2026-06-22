import { Definition } from '@/types';

type DefinitionProps = {
    definition: Definition;
    index: number;
};

const DefinitionComponent = ({ definition, index }: DefinitionProps) => {
    const rawDefinition = definition.definition ?? '';
    const hasColon = rawDefinition.includes(':');
    const firstColonIndex = rawDefinition.indexOf(':');

    const leftSide = hasColon ? rawDefinition.slice(0, firstColonIndex).trim() : '';
    const rightSide = hasColon ? rawDefinition.slice(firstColonIndex + 1).trim() : '';

    // Check if the left side of the colon is a phrase/word label (short, no period, etc.)
    const isPhraseLabel = hasColon && leftSide.length > 0 && leftSide.length < 50 && !leftSide.includes('.');

    const phrasePart = isPhraseLabel ? leftSide : null;
    const definitionPart = isPhraseLabel ? rightSide : rawDefinition;

    return (
        <li className="my-2">
            <div className="flex flex-col gap-2">
                <div className="lexicon-box text-foreground text-sm leading-relaxed">
                    {phrasePart && (
                        <strong className="font-semibold mr-1.5 text-foreground">{phrasePart}:</strong>
                    )}
                    {definitionPart?.length
                        ? definitionPart.split(' ').map((word, defIndex) => (
                              <span key={`${index}-${defIndex}`}>
                                  <span className="lexicon cursor-pointer decoration-2 underline-offset-4">
                                      {word}
                                  </span>{' '}
                              </span>
                          ))
                        : !phrasePart && 'No definition found'}
                </div>
                {!!definition?.example?.length && (
                    <p className="border-border text-muted-foreground border-l-2 pl-3 text-sm">{definition.example}</p>
                )}
            </div>
        </li>
    );
};

export default DefinitionComponent;
