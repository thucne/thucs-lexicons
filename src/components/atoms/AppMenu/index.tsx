'use client';

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        border: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(1),
        minWidth: 180,
        maxWidth: 250,
        color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5)
            },
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
            }
        }
    }
}));

type AppMenuProps = {
    menuId: string;
    anchorEl: HTMLElement | null;
    anchorElId: string;
    onClose: () => void;
} & React.PropsWithChildren &
    Partial<MenuProps>;

export default function AppMenu({ menuId, anchorEl, anchorElId, onClose, children, className }: AppMenuProps) {
    const open = Boolean(anchorEl);

    const handleClose = () => {
        onClose();
    };

    return (
        <StyledMenu
            id={menuId}
            className={`${className} app-menu`}
            MenuListProps={{
                'aria-labelledby': anchorElId
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            {children}
        </StyledMenu>
    );
}
