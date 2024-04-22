'use client';

import { startTransition, useEffect } from 'react';
import { Chip, Divider, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectFavoriteLexicons, toggleAndPersistFavoriteLexicon } from '@/redux/reducers/favoriteLexicons';
import { CheckIcon } from '@/components/atoms/AppIcons';
import { selectAuthStatus } from '@/redux/reducers/authStatus';
import { AuthStatus } from '@/hooks/use-init';
import { useOptimistic } from '@/hooks/use-optimistic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from '@/utils';

const ToggleFavorite = ({ word }: { word: string }) => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const favorite = searchParams.get('favorite');
    const shouldToggle = favorite === 'toggle';

    const favoriteLexicons = useAppSelector(selectFavoriteLexicons);
    const authStatus = useAppSelector(selectAuthStatus);
    const isLoading = authStatus !== AuthStatus.Loaded;

    const [isFavoriteOptimistic, toggleFavoriteOptimistic] = useOptimistic<boolean, boolean>(
        favoriteLexicons.includes(word),
        (_, optimisticValue) => optimisticValue
    );

    const handleToggleFavorites = async () => {
        const optimistic = !isFavoriteOptimistic;
        startTransition(() => {
            toggleFavoriteOptimistic(optimistic);
        });

        /**
         * Toggle the comment below to see the difference between optimistic
         *      and non-optimistic behavior.
         * In this case, the optimistic behavior is to toggle the favorite state
         *      immediately and update the UI.
         * I assume the word is not the current word (simulate failing to update)
         *  ( --> so the UI will be updated accordingly after the request is done).
         */
        // await dispatch(toggleAndPersistFavoriteLexicon('sth else'));
        await dispatch(toggleAndPersistFavoriteLexicon(word));
    };

    useEffect(() => {
        toggleFavoriteOptimistic(favoriteLexicons.includes(word));
    }, [favoriteLexicons, word, toggleFavoriteOptimistic]);

    useEffect(() => {
        if (shouldToggle) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('favorite');
            dispatch(toggleAndPersistFavoriteLexicon(word)).finally(() => {
                router.replace(createUrl(pathname, newSearchParams));
            });
        }
    }, [shouldToggle, pathname, router, searchParams, dispatch, word]);

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
                        label={isLoading ? 'Loading...' : isFavoriteOptimistic ? 'Favorite' : 'Add to favorites'}
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
