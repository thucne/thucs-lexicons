import { useState, useContext } from "react";

import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  LightModeIcon,
  DarkModeRoundedIcon,
  SystemModeIcon,
} from "@/components/atoms/AppIcons";

import AppMenu from "@/components/atoms/AppMenu";
import AppMenuItem from "@/components/atoms/AppMenu/AppMenuItem";

const themeMenuId = "theme-menu-id";
const themeBtnSelectId = "theme-btn-select-id";

import { ColorModeContext } from "@/components/organisms/Wrappers/ThemeProvider";

const StyledAppMenuItem = styled(AppMenuItem)(({ theme }) => ({}));

const ThemeSelect = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const colorMode = useContext(ColorModeContext);
  const currentMode = colorMode.mode();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getButtonIcon = () => {
    switch (currentMode) {
      case "light":
        return <LightModeIcon />;
      case "dark":
        return <DarkModeRoundedIcon />;
      case "system":
        return <SystemModeIcon />;
    }
  };

  const handleChange = (mode: string) => {
    colorMode.toggleColorMode(mode);
    handleClose();
  };

  console.log(currentMode);

  return (
    <div>
      <IconButton
        id={themeBtnSelectId}
        aria-controls={open ? themeMenuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {getButtonIcon()}
      </IconButton>
      <AppMenu
        anchorEl={anchorEl}
        anchorElId={themeBtnSelectId}
        menuId={themeMenuId}
        onClose={handleClose}
      >
        <StyledAppMenuItem
          onClick={() => handleChange("light")}
          selected={currentMode === "light"}
        >
          <LightModeIcon />
          Light
        </StyledAppMenuItem>
        <StyledAppMenuItem
          onClick={() => handleChange("dark")}
          selected={currentMode === "dark"}
        >
          <DarkModeRoundedIcon />
          Dark
        </StyledAppMenuItem>
        <StyledAppMenuItem
          onClick={() => handleChange("system")}
          selected={currentMode === "system"}
        >
          <SystemModeIcon />
          System
        </StyledAppMenuItem>
      </AppMenu>
    </div>
  );
};

export default ThemeSelect;
