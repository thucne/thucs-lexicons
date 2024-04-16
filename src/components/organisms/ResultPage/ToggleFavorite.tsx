'use client';

import {  startTransition, useEffect } from 'react';
import { Chip, Divider, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectFavoriteLexicons, toggleAndPersistFavoriteLexicon } from '@/redux/reducers/favoriteLexicons';
import { CheckIcon } from '@/components/atoms/AppIcons';
import { selectAuthStatus } from '@/redux/reducers/authStatus';
import { AuthStatus } from '@/hooks/use-init';
import { useOptimistic } from '@/hooks/use-optimistic';

const ToggleFavorite = ({ word }: { word: string }) => {
    const dispatch = useAppDispatch();
    const favoriteLexicons = useAppSelector(selectFavoriteLexicons);
    const authStatus = useAppSelector(selectAuthStatus);
    const isLoading = authStatus !== AuthStatus.Loaded;

    const [isFavoriteOptimistic, toggleFavoriteOptimistic] = useOptimistic<boolean, boolean>(
        favoriteLexicons.includes(word),
        (_, optimisticValue) => optimisticValue
    );

    const handleToggleFavorites = async () => {
        startTransition(() => {
            toggleFavoriteOptimistic(!isFavoriteOptimistic);
        });
        // await dispatch(toggleAndPersistFavoriteLexicon('sth else'));
        await dispatch(toggleAndPersistFavoriteLexicon(word));
    };

    useEffect(() => {
        toggleFavoriteOptimistic(favoriteLexicons.includes(word));
    }, [favoriteLexicons, word, toggleFavoriteOptimistic]);

    console.log('favoriteLexicons ', favoriteLexicons);
    console.log('optimistic ', isFavoriteOptimistic);

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
                        label={isLoading ? 'Loading...': isFavoriteOptimistic ? 'Favorite' : 'Add to favorites'}
                        variant={isFavoriteOptimistic ? 'filled' : 'outlined'}
                        clickable
                        onClick={handleToggleFavorites}
                        deleteIcon={!isLoading && isFavoriteOptimistic ? <CheckIcon /> : undefined}
                        onDelete={!isLoading && isFavoriteOptimistic ? handleToggleFavorites : undefined}
                        disabled={isLoading || word === ''}
                    />
                </span>
            </Tooltip>
        </Divider>
    );
};

export default ToggleFavorite;
