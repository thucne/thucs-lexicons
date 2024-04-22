import React from 'react';

import { Menu } from '@mui/material';

type QuickMeaningProps = {
    word: string;
    open: boolean;
    onClose: () => void;
    anchorEl: null | HTMLElement;
};

const QuickMeaning = ({ word, open, onClose, anchorEl }: QuickMeaningProps) => {
    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            Ahihi {word}
        </Menu>
    );
};

export default QuickMeaning;
