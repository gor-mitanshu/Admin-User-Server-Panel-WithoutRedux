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
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { toast } from "react-toastify";

interface IUser {
  password: string;
  confirmPassword: string;
}

const Copyright = (props: any) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" target="_blank" to="https://brainsquaretech.com/">
        BrainSquare Tech
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const defaultTheme = createTheme();

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser>({
    password: "",
    confirmPassword: "",
  });

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
    if (!user.password) {
      showErrorWithTimeout("Please Enter Password", 3000);
      return;
    }
    if (user.password !== user.confirmPassword) {
      showErrorWithTimeout("Passwords do not match", 3000);
      return;
    }
    try {
      const body = {
        password: user.password,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API}/admin/resetpassword/${id}/${token}`,
        body
      );
      if (!!res) {
        navigate("/sign-in");
        toast.success(res.data.message);
      }
    } catch (error: any) {
      showErrorWithTimeout(error.response.data.message, 3000);
      return;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={5}
          sx={{
            border: "1px",
            marginTop: 4,
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>
            {error && (
              <Typography marginY={1} textAlign={"center"} color="error">
                <b>Error:</b> {error}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                placeholder="Please Enter a new password"
                name="password"
                autoComplete="password"
                type="password"
                autoFocus
                value={user.password}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Please confirm your password"
                name="confirmPassword"
                autoComplete="password"
                type="password"
                value={user.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ my: 2 }}
              >
                Reset
              </Button>
            </Box>
          </Box>
          <Copyright sx={{ my: 2 }} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPassword;
