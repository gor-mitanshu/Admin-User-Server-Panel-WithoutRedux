import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Product = ({ product }: any) => {
  const navigate = useNavigate();
  const checkOutHandler = async () => {
    try {
      const amount = product.price;
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API}/loggeduser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);
      const data = response.data.data;

      const { _id: userId, firstname, lastname, email } = data;

      const {
        data: { order },
      } = await axios.post(`${process.env.REACT_APP_API}/checkout`, {
        amount,
        userId,
        userName: `${firstname} ${lastname}`,
        userEmail: email,
      });

      console.log(order);

      const options = {
        key: process.env.REACT_APP_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: product.name,
        description: "Test Transaction",
        image: product.image,
        order_id: order.id,
        // callback_url: `${process.env.REACT_APP_API}/paymentVerification`,
        prefill: {
          name: `${firstname} ${lastname}`,
          email: email,
          contact: "1234567890",
        },
        handler: async function (response: any) {
          debugger;
          console.log(response);
          const body = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            uid: data._id,
            amount: order.amount,
            order_id: order.id,
            currency: order.currency,
            order_created_at: order.created_at,
            amount_due: order.amount_due,
            amount_paid: order.amount_paid,
            attempts: order.attempts,
          };
          const res = await axios.post(
            `${process.env.REACT_APP_API}/getRazorPaydetails`,
            body
          );
          if (!!res) {
            toast.success(res.data.message);
            console.log(res);
            navigate("/paymentsuccess");
          }
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature);
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = (window as any).Razorpay(options);
      razor.open();
      console.log(razor);
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
            image={product.image}
            alt={product.name}
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
              {product.name}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {product.price} ₹
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

export default Product;
