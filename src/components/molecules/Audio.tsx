import { useRef, useState } from 'react';

import { AudioIcon, AudioNotFoundIcon } from '@/components/atoms/AppIcons';
import { Phonetic } from '@/types';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { getLicenseString } from '@/utils';

type AudioProps = {
    phonetic: Phonetic;
};

const Audio = ({ phonetic }: AudioProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [shouldDisable, setShouldDisable] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        if (!isPlaying && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    const onError = () => setShouldDisable(true);

    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip
                title={
                    shouldDisable || !phonetic.audio
                        ? 'Audio not found or cannot be played.'
                        : `Click to play | ${phonetic.text} | ${getLicenseString(phonetic.license)}`
                }
            >
                <span>
                    <IconButton
                        size="small"
                        component="button"
                        onClick={handlePlay}
                        disabled={!phonetic.audio || shouldDisable || isPlaying}
                        sx={{ border: 'none' }}
                    >
                        {phonetic.audio ? <AudioIcon /> : <AudioNotFoundIcon />}
                    </IconButton>
                </span>
            </Tooltip>
            <Typography variant="body2">{phonetic.text}</Typography>
            <audio ref={audioRef} controls={false} className="hidden" onError={onError} onEnded={handleEnded}>
                <source src={phonetic.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
        </Stack>
    );
};

export default Audio;
