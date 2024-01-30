import { Box, InputBase } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { FC, useState } from "react";

const SearchInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchField: FC<{
  open?: boolean;
  onChange: (v: string) => void;
}> = ({ open, onChange }) => {
  const [searchStr, setSearchStr] = useState("");

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
          },
          marginLeft: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            padding: (theme) => theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchIcon />
        </Box>

        <SearchInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchStr}
          onChange={(event) => {
            const value = event.target.value;
            setSearchStr(value);
            onChange(value);
          }}
        />
      </Box>
    </>
  );
};
export default SearchField;
