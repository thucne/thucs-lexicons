"use client";
import { useState, useRef, useLayoutEffect } from "react";

import { TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const BootstrapInput = styled(TextField)(({ theme }) => ({
  width: "100%",
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "&.MuiTextField-root": {
    display: "flex",
    maxWidth: 400,
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    fontSize: 16,
    width: "100%",
    padding: "8px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SearchBar = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  // DOM manipulation, so we use useLayoutEffect
  useLayoutEffect(() => {
    // run on next execution loop, so focus() works
    setTimeout(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, 0);
  }, []);

  return (
    <BootstrapInput
      id="search"
      placeholder="Search…"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      inputRef={searchRef}
    />
  );
};

export default SearchBar;
