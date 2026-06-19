import { Definition } from '@/types';

type DefinitionProps = {
    definition: Definition;
    index: number;
};

const DefinitionComponent = ({ definition, index }: DefinitionProps) => {
    return (
        <li className="my-2">
            <div className="flex flex-col gap-2">
                <p className="lexicon-box text-foreground text-sm leading-relaxed">
                    {definition.definition?.length
                        ? definition.definition.split(' ').map((word, defIndex) => (
                              <span key={`${index}-${defIndex}`}>
                                  <span className="lexicon cursor-pointer decoration-2 underline-offset-4">
                                      {word}
                                  </span>{' '}
                              </span>
                          ))
                        : 'No definition found'}
                </p>
                {!!definition?.example?.length && (
                    <p className="border-border text-muted-foreground border-l-2 pl-3 text-sm">{definition.example}</p>
                )}
            </div>
        </li>
    );
};

export default DefinitionComponent;
