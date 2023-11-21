import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  Typography,
  Paper,
  Button,
  Link,
} from "@mui/material";

const PaymentFailure = ({ open, handleClose }: any) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
          <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h4" color="error" gutterBottom>
              Payment Failed
            </Typography>

            <Paper elevation={1} sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="h6" gutterBottom>
                Oops! Something went wrong with your payment.
              </Typography>
              <Typography>
                Please check your payment details and try again.
              </Typography>
            </Paper>

            <Button
              sx={{ marginTop: 3 }}
              variant="contained"
              component={Link}
              href="/payment"
              color="primary"
              onClick={handleClose}
            >
              Go Back
            </Button>
          </Paper>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFailure;
