import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';
import iconButtonStyles from './IconButton';

const components: Components<Theme> = {
    MuiIconButton: {
        styleOverrides: iconButtonStyles
    }
};

export default components;
