import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Close } from "@mui/icons-material";

const SuccessModal = ({
  open,
  handleClose,
  referenceNum,
  paymentDetails,
}: any) => {
  return (
    <Dialog
      open={open}
      // onClose={handleClose}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Container
          maxWidth="sm"
          // sx={{ marginTop: 4 }}
        >
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
                <strong>Amount Paid:</strong> {paymentDetails?.amount} ₹
              </Typography>
              <Typography>Thank you for your purchase!</Typography>
            </Paper>

            <Button
              sx={{ marginTop: 3 }}
              variant="contained"
              color="primary"
              onClick={handleClose}
            >
              Close
            </Button>
          </Paper>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
