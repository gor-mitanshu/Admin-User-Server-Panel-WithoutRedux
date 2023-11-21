import React from "react";
import { Grid } from "@mui/material";
import Product from "./Card";

function Payment() {
  const laptopDetails = {
    name: "Laptop",
    price: 6,
    image:
      "https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png",
  };

  return (
    <Grid padding={2}>
      <Product product={laptopDetails} />
    </Grid>
  );
}

export default Payment;
