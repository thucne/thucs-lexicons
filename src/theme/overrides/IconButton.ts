import { IconButtonClasses } from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';
import { OverridesStyleRules } from '@mui/material/styles/overrides';

const iconButtonStyles: Partial<OverridesStyleRules<keyof IconButtonClasses, 'MuiIconButton', Theme>> = {
    root: ({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        '&& .MuiTouchRipple-root *': {
            borderRadius: theme.shape.borderRadius
        }
    })
};

export default iconButtonStyles;
