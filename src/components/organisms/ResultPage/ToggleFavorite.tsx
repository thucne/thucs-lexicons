'use client';

import { useOptimistic, startTransition } from 'react';
import { Chip, Divider, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectFavoriteLexicons, toggleAndPersistFavoriteLexicon } from '@/redux/reducers/favoriteLexicons';
import { CheckIcon } from '@/components/atoms/AppIcons';

const ToggleFavorite = ({ word }: { word: string }) => {
    const dispatch = useAppDispatch();
    const favoriteLexicons = useAppSelector(selectFavoriteLexicons);

    const [isFavoriteOptimistic, toggleFavoriteOptimistic] = useOptimistic<boolean, boolean>(
        favoriteLexicons.includes(word),
        (_, optimisticValue) => optimisticValue
    );

    const handleToggleFavorites = async () => {
        startTransition(() => {
            toggleFavoriteOptimistic(!isFavoriteOptimistic);
        });

        await dispatch(toggleAndPersistFavoriteLexicon(word));
    };

    console.log('optimistic ', isFavoriteOptimistic);
    console.log('favoriteLexicons ', favoriteLexicons);

    return (
        <Divider
            className="my-4"
            textAlign="right"
            sx={{
                '::before, ::after': {
                    borderTopColor: (theme) => theme.palette.warning.main
                }
            }}
        >
            <Tooltip title={isFavoriteOptimistic ? 'Remove from favorites' : 'Add to favorites'}>
                <span>
                    <Chip
                        size="small"
                        color="warning"
                        label={isFavoriteOptimistic ? 'Favorite' : 'Add to favorites'}
                        variant={isFavoriteOptimistic ? 'filled' : 'outlined'}
                        clickable
                        onClick={handleToggleFavorites}
                        deleteIcon={isFavoriteOptimistic ? <CheckIcon /> : undefined}
                        onDelete={isFavoriteOptimistic ? handleToggleFavorites : undefined}
                        disabled={word === ''}
                    />
                </span>
            </Tooltip>
        </Divider>
    );
};

export default ToggleFavorite;
