import { SearchResult } from '@/types';
import { Separator } from '@/components/ui/separator';
import Audio from '@/components/molecules/Audio';
import MeaningComponent from '@/components/molecules/Meaning';
import { getLicenseString } from '@/utils';
import { isPhoneticRegex } from '@/utils/regex';

type MeaningGroupProps = {
    meaning: SearchResult;
    id: string;
    word: string;
    compactHeader?: boolean;
};

const getWordTitle = (word: string, meaning: SearchResult) => {
    if (word !== meaning.word) {
        return [word, meaning.word];
    }

    if (meaning?.didYouMean) {
        return [meaning.word, meaning.didYouMean];
    }
    return [meaning.word, ''];
};

const MeaningGroup = ({ meaning, id, word, compactHeader = false }: MeaningGroupProps) => {
    const [searchedWord, didYouMean] = getWordTitle(word, meaning);
    const isPhonetic = isPhoneticRegex.test(didYouMean ?? '');

    return (
        <div className="grid gap-4">
            {!compactHeader && (
                <>
                    <div>
                        <h2 className="text-2xl font-semibold" title={getLicenseString(meaning.license)}>
                            {searchedWord}
                        </h2>
                        {didYouMean && !isPhonetic && (
                            <p className="mt-1 text-sm">
                                Did you mean <span className="font-semibold">{didYouMean}</span>?
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">{meaning.phonetic}</h3>
                        <div className="flex flex-wrap gap-2">
                            {meaning.phonetics?.map((phonetic, phoneticIndex) => (
                                <Audio key={`${meaning.word}-phonetic-${phoneticIndex}`} phonetic={phonetic} />
                            ))}
                        </div>
                    </div>
                </>
            )}
            <Separator />
            {meaning.meanings.map((eachMeaning, eachMeaningIndex) => (
                <div key={`${meaning.word}-meaning-${id}-${eachMeaningIndex}`}>
                    <MeaningComponent meaning={eachMeaning} index={eachMeaningIndex} />
                    {eachMeaningIndex < meaning.meanings.length - 1 && <Separator className="mt-4" />}
                </div>
            ))}
        </div>
    );
};

export default MeaningGroup;
