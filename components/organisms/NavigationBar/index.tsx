"use client";

import React from "react";

import Image from "next/image";

import Grid from "@/components/atoms/AppGrid";
import { Box, Typography } from "@mui/material";

import ThemeSelect from "@/components/molecules/ThemeSelect";
import { StyledBox } from "./styles";
import SearchBar from "../SearchBar";

const NavigationBar = () => {
  return (
    <Box
      p={1}
      pb={(theme) => `calc(${theme.spacing(1)} + 1px)`}
      borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid xs="auto" container alignItems="center">
          <Grid>
            <Image src="/logo.svg" alt="logo" width={50} height={50} />
          </Grid>
          <Grid>
            <Typography variant="h6">My Lexicons</Typography>
          </Grid>
        </Grid>
        <Grid xs display="flex" justifyContent="center">
          <SearchBar />
        </Grid>
        <Grid xs="auto">
          <ThemeSelect />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NavigationBar;
