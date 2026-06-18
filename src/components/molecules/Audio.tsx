import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Phonetic } from '@/types';
import { getLicenseString } from '@/utils';
import { cn } from '@/lib/utils';

type AudioProps = {
    phonetic: Phonetic;
    showPhonetic?: boolean;
    className?: string;
};

const Audio = ({ phonetic, showPhonetic = true, className }: AudioProps) => {
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

    const hasAudio = Boolean(phonetic.audio?.trim());
    const Icon = hasAudio ? Volume2 : VolumeX;

    const tooltipText =
        shouldDisable || !hasAudio
            ? 'Audio not found or cannot be played.'
            : `Click to play | ${phonetic.text} | ${getLicenseString(phonetic.license)}`;

    return (
        <span className={cn('inline-flex items-center gap-2', className)}>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={handlePlay}
                            disabled={!hasAudio || shouldDisable || isPlaying}
                            aria-label="Play pronunciation"
                        />
                    }
                >
                    <Icon className="size-4" />
                </TooltipTrigger>
                <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
            {showPhonetic && <span className="text-sm">{phonetic.text}</span>}
            {hasAudio && (
                <audio ref={audioRef} controls={false} className="hidden" onError={onError} onEnded={handleEnded}>
                    <source src={phonetic.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </span>
    );
};

export default Audio;
