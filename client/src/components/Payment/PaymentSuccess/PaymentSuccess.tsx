import React from "react";
import { Container, Typography, Paper, Button, Link } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const referenceNum = searchQuery.get("reference");

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <CheckCircleIcon
          color="success"
          sx={{
            fontSize: 80,
            marginBottom: 2,
            animation: "grow 0.6s ease-in-out",
          }}
        />

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
            <strong>Amount Paid:</strong> 6 ₹{/* $100.00 */}
          </Typography>
          <Typography>Thank you for your purchase!</Typography>
        </Paper>

        <Button
          sx={{ marginTop: 3 }}
          variant="contained"
          component={Link}
          href="/payment"
          color="primary"
        >
          Go Back
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
