import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {
  Paper,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { toast } from "react-toastify";

const defaultTheme = createTheme();

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({
    email: "",
    otp: "",
  });
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const showErrorWithTimeout = (errorMessage: string, timeout: number) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, timeout);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUserDetails) => ({
      ...prevUserDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.email) {
      showErrorWithTimeout("Please Enter Email", 3000);
      return;
    }
    setLoading(true);
    try {
      const body = {
        email: user.email,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API}/user/forgetpassword`,
        body
      );
      if (!!res) {
        setLoading(false);
        setShowOTPInput(true);
        toast.warn("Please Check Your Gmail");
      }
    } catch (error: any) {
      setLoading(false);
      showErrorWithTimeout(error.response.data.message, 3000);
    }
  };

  const handleOTPSuccess = async () => {
    setLoading(true);

    if (!user.otp) {
      showErrorWithTimeout("Please Enter OTP to verify", 3000);
      setLoading(false);
      return;
    }
    const body = {
      email: user.email,
      otp: user.otp,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/user/verifyotp`,
        body
      );
      if (!!res) {
        setLoading(false);
        const { token, id } = res.data.data;

        navigate(`/reset-password/${id}/${token}`);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      showErrorWithTimeout(error.response.data.message, 3000);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forget Password
          </Typography>

          <div>
            {error && (
              <Typography textAlign={"center"} color={"error"} sx={{ mt: 2 }}>
                <b>Error:</b> {error}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={user.email}
                onChange={handleChange}
              />
              {showOTPInput ? (
                <div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="Enter OTP"
                    name="otp"
                    autoComplete="off"
                    value={user.otp}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="contained"
                    sx={{ mt: 2, width: "100%" }}
                    onClick={handleOTPSuccess}
                  >
                    {loading ? <Loader /> : "Verify OTP"}
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, width: "100%" }}
                >
                  {loading ? <Loader /> : "Send"}
                </Button>
              )}
              <Button
                type="button"
                variant="contained"
                sx={{ mt: 2, width: "100%" }}
                color="error"
                onClick={() => navigate("/sign-in")}
              >
                Cancel
              </Button>
            </Box>
          </div>
        </Paper>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          {`Copyright © ${new Date().getFullYear()} `}
          <Link color="inherit" to="https://brainsquaretech.com/">
            BrainSquare Tech
          </Link>
          {"."}
        </Typography>
      </Container>
    </ThemeProvider>
  );
};

export default ForgetPassword;
