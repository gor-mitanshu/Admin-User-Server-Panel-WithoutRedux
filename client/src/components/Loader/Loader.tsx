import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const Loader = ({ height, width }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height,
        width: width,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
