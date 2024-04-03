import { SearchResult } from '@/types';
import { Divider, Typography } from '@mui/material';

import Grid from '@/components/atoms/AppGrid';
import Audio from '@/components/molecules/Audio';
import { getLicenseString } from '@/utils';
import MeaningComponent from '@/components/molecules/Meaning';

type MeaningGroupProps = {
    meaning: SearchResult;
    id: string;
};

const MeaningGroup = ({ meaning, id }: MeaningGroupProps) => {
    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Typography variant="h4" component="h2" title={getLicenseString(meaning.license)}>
                    {meaning.word}
                </Typography>
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
                        <MeaningComponent meaning={eachMeaning} />
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
