import React from "react";
import { Container, Typography, Paper, Button, Link } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const searchQuerry = useSearchParams()[0];
  // console.log(searchQuerry.get("reference"));
  const referenceNum = searchQuerry.get("reference");
  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" color="success.main" gutterBottom>
          Payment Successful!
        </Typography>

        <Paper elevation={1} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Typography paragraph>
            <strong>Order ID:</strong> {referenceNum}
          </Typography>
          <Typography paragraph>
            <strong>Amount Paid:</strong> 5000 ₹{/* $100.00 */}
          </Typography>
          {/* Add more order details as needed */}
          <Typography>Thank you for your purchase!</Typography>
        </Paper>

        {/* You may want to provide links to go back to the homepage or view order history */}
        <div style={{ marginTop: 3 }}>
          <Button
            variant="contained"
            component={Link}
            href="/payment"
            color="primary"
          >
            Go Back
          </Button>
          {/* <span style={{ margin: "0 10px" }}>|</span>
          <Button
            variant="contained"
            component={Link}
            href="/order-history"
            color="primary"
          >
            View Order History
          </Button> */}
        </div>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
