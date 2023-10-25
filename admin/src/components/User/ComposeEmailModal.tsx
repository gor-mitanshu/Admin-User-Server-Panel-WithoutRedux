import React, { useState } from "react";
import { Modal, Paper, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Close from "@mui/icons-material/Close";
import Loader from "../Loader/Loader";

interface ComposeEmailModalProps {
  open: boolean;
  onClose: () => void;
  to: string;
  from: string;
}

const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  open,
  onClose,
  to,
  from,
}) => {
  const [emailFields, setEmailFields] = useState({
    subject: "",
    body: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showErrorWithTimeout = (errorMessage: string, timeout: number) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, timeout);
  };

  const handleEmailFieldChange = (field: string, value: string) => {
    setEmailFields({
      ...emailFields,
      [field]: value,
    });
  };

  const handleSendClick = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!emailFields.subject) {
        showErrorWithTimeout("Please Enter a Subject", 3000);
        setIsLoading(false);
        return;
      }
      if (!emailFields.body) {
        showErrorWithTimeout("Body cannot be empty", 3000);
        setIsLoading(false);
        return;
      }
      const { subject, body } = emailFields;
      const send = {
        to: to,
        from: from,
        subject: subject,
        body: body,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API}/send-email`,
        send
      );
      if (!!res) {
        toast.success(res.data.message);
        onClose();
        setIsLoading(false);
        setEmailFields({
          subject: "",
          body: "",
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      // onClose={onClose}
      aria-labelledby="compose-email-modal"
      aria-describedby="compose-email-form"
    >
      <Paper elevation={3} className="modal-container">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} disableElevation>
            <Close fontSize="large" color="action" />
          </Button>
        </div>
        <Typography variant="h5" marginBottom={3}>
          Compose an Email to <span style={{ color: "red" }}>{to}</span>
        </Typography>
        {error && (
          <Typography textAlign={"center"} color={"error"} sx={{ mt: 2 }}>
            <b>Error:</b> {error}
          </Typography>
        )}
        <TextField
          label="To"
          fullWidth
          margin="normal"
          variant="outlined"
          disabled
          value={to}
        />
        <TextField
          label="From"
          fullWidth
          margin="normal"
          variant="outlined"
          disabled
          value={from}
        />
        <TextField
          label="Subject"
          fullWidth
          margin="normal"
          variant="outlined"
          value={emailFields.subject}
          onChange={(e) => handleEmailFieldChange("subject", e.target.value)}
        />
        <TextField
          label="Body"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          variant="outlined"
          value={emailFields.body}
          onChange={(e) => handleEmailFieldChange("body", e.target.value)}
        />
        {!isLoading ? (
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{ marginRight: "8px" }}
          >
            Cancel
          </Button>
        ) : null}

        <Button variant="contained" color="primary" onClick={handleSendClick}>
          {isLoading ? <Loader /> : "Send"}
        </Button>
      </Paper>
    </Modal>
  );
};

export default ComposeEmailModal;
