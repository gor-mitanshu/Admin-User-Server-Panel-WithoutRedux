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
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

interface IUser {
  password: string;
  cpassword: string;
}

const defaultTheme = createTheme();

const SidebarChangePassword = () => {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser>({
    password: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event: any) => event.preventDefault();

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
    if (user.cpassword !== user.password) {
      showErrorWithTimeout("Please Enter the same Password", 3000);
      return;
    }
    try {
      const body = {
        password: user.password,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API}/change-adminpassword/${id}`,
        body
      );
      if (!!res) {
        toast.success("Passwords updated successfully");
        setUser({
          password: "",
          cpassword: "",
        });
      }
    } catch (error: any) {
      console.log(error);
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
              justifyContent: "flex-start",
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
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={user.password}
                onChange={handleChange}
                name="password"
                sx={{ margin: "25px 0 0 0 " }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type={showPassword ? "text" : "password"}
                label="Confirm Password"
                sx={{ margin: "20px 0 0 0" }}
                fullWidth
                value={user.cpassword}
                onChange={handleChange}
                name="cpassword"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2, width: "100%" }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default SidebarChangePassword;
