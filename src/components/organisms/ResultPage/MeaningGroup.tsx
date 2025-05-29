import { SearchResult } from '@/types';
import { Divider, Typography } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

import Grid from '@/components/atoms/AppGrid';
import Audio from '@/components/molecules/Audio';
import MeaningComponent from '@/components/molecules/Meaning';
import { getLicenseString } from '@/utils';

type MeaningGroupProps = {
    meaning: SearchResult;
    id: string;
    word: string;
};

const getWordTitle = (word: string, meaning: SearchResult) => {
    if (word !== meaning.word) {
        return [word, meaning.word];
    }

    if (meaning?.correctedWord) {
        return [meaning.word, meaning.correctedWord];
    }
    return [meaning.word, ''];
};

const MeaningGroup = ({ meaning, id, word }: MeaningGroupProps) => {
    const [searchedWord, correctedWord] = getWordTitle(word, meaning);

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Typography variant="h4" component="h2" title={getLicenseString(meaning.license)}>
                    {searchedWord}
                </Typography>
                {correctedWord && (
                    <Typography variant="body2" component="h3" className="mt-1">
                        Did you mean: <span className="font-bold text-yellow-500">» {correctedWord} «</span>
                        <br/>

                    </Typography>
                )}
            </Grid>
            <Grid xs={12} container alignItems="center" spacing={0.5}>
                <Grid xs={12}>
                    <Typography variant="h6" component="h3">
                        {meaning.phonetic}
                    </Typography>
                </Grid>
                <Grid>
                    <Typography>Phonetics</Typography>
                </Grid>
                {meaning.phonetics?.map((phonetic, phoneticIndex) => {
                    return (
                        <Grid key={`${meaning.word}-phonetic-${phoneticIndex}`}>
                            <Audio phonetic={phonetic} />
                        </Grid>
                    );
                })}
            </Grid>
            <Grid xs={12}>
                <Divider sx={{ borderColor: (theme) => theme.palette.warning.main }} />
            </Grid>
            {meaning.meanings.map((eachMeaning, eachMeaningIndex) => {
                return [
                    <Grid key={`${meaning.word}-meaning-${id}-${eachMeaningIndex}`} xs={12}>
                        <MeaningComponent meaning={eachMeaning} index={eachMeaningIndex} />
                    </Grid>,
                    eachMeaningIndex < meaning.meanings.length - 1 && (
                        <Grid key={`${meaning.word}-divider-${id}-${eachMeaningIndex}`} xs={12}>
                            <Divider />
                        </Grid>
                    )
                ];
            })}
        </Grid>
    );
};

export default MeaningGroup;
