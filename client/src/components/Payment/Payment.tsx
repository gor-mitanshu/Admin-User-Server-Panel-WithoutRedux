import React, { useState } from "react";
import axios from "axios";
import Cards from "./Card";
import { Grid } from "@mui/material";

function Payment() {
  return (
    <Grid padding={2}>
      <Cards />
    </Grid>
  );
}

export default Payment;
