import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

function Payment() {
  const laptopDetails = {
    name: "Laptop",
    // price: 600 * 100,
    price: 6000,
    image:
      "https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png",
  };

  return (
    <Grid padding={2}>
      <ProductCard product={laptopDetails} />
    </Grid>
  );
}

export default Payment;
