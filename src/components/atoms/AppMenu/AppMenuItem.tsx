import React, { PropsWithChildren } from "react";

import { MenuItem, MenuItemProps } from "@mui/material";

interface AppMenuItemProps extends PropsWithChildren, MenuItemProps {
  onClick: () => void;
}

const AppMenuItem = ({ children, onClick, ...props }: AppMenuItemProps) => {
  return (
    <MenuItem onClick={onClick} disableRipple {...props}>
      {children}
    </MenuItem>
  );
};

export default AppMenuItem;
