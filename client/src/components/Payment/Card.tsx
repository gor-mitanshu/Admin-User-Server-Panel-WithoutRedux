import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import axios from "axios";

const Cards = () => {
  // console.log(process.env.REACT_APP_KEY_ID);
  const checkOutHandler = async () => {
    try {
      const amount = 6;
      const {
        data: { order },
      } = await axios.post(`${process.env.REACT_APP_API}/checkout`, {
        amount,
      });
      console.log(window);
      console.log(order);
      const options = {
        key: process.env.REACT_APP_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "XYZ ABC",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id,
        callback_url: `${process.env.REACT_APP_API}/paymentVerification`,
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "1234567890",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor: any = (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="150"
            image="https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"
            alt="green iguana"
          />
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography gutterBottom variant="h5" component="div">
              Laptop
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              6 ₹
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={checkOutHandler}
          >
            Buy
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Cards;
