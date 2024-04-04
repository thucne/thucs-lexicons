import { useState, useContext } from 'react';

import { IconButton, useTheme } from '@mui/material';

import AppMenu from '@/components/atoms/AppMenu';
import AppMenuItem from '@/components/atoms/AppMenu/AppMenuItem';
import { LightModeIcon, DarkModeIcon, SystemModeIcon } from '@/components/atoms/AppIcons';
import { ColorModeContext } from '@/components/organisms/Wrappers/ThemeProvider';

const themeMenuId = 'theme-menu-id';
const themeBtnSelectId = 'theme-btn-select-id';

const ThemeSelect = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();

    const selectedMode = colorMode.mode();
    const transformedMode = theme.palette.mode;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getButtonIcon = () => {
        switch (transformedMode) {
            case 'light':
                return <LightModeIcon />;
            case 'dark':
                return <DarkModeIcon />;
            default:
                return null;
        }
    };

    const handleChange = (mode: string) => {
        colorMode.toggleColorMode(mode);
        handleClose();
    };

    return (
        <div>
            <IconButton
                id={themeBtnSelectId}
                aria-controls={open ? themeMenuId : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {getButtonIcon()}
            </IconButton>
            <AppMenu anchorEl={anchorEl} anchorElId={themeBtnSelectId} menuId={themeMenuId} onClose={handleClose}>
                <AppMenuItem onClick={() => handleChange('light')} selected={selectedMode === 'light'}>
                    <LightModeIcon />
                    Light
                </AppMenuItem>
                <AppMenuItem onClick={() => handleChange('dark')} selected={selectedMode === 'dark'}>
                    <DarkModeIcon />
                    Dark
                </AppMenuItem>
                <AppMenuItem onClick={() => handleChange('system')} selected={selectedMode === 'system'}>
                    <SystemModeIcon />
                    System
                </AppMenuItem>
            </AppMenu>
        </div>
    );
};

export default ThemeSelect;
