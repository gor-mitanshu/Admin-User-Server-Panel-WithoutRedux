import React, { useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Delete } from "@mui/icons-material";
import Loader from "../../Loader/Loader";
import MuiPhoneNumber from "material-ui-phone-number";

interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  // phonenumber: string;
  password: string;
  cpassword: string;
  picture: string;
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
      <Link color="inherit" to="https://brainsquaretech.com/">
        BrainSquareTech
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const defaultTheme = createTheme();

const SignUp = ({ height, width }: any) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    // phonenumber: "",
    password: "",
    cpassword: "",
    picture: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const inputRef = useRef<any>(null);

  const removeImage = () => {
    setSelectedImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const showErrorWithTimeout = (errorMessage: string, timeout: number) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, timeout);
  };

  const handleChange = (e: any, field?: string) => {
    const { name, value, files } = e.target;
    if (field === "picture" && files.length > 0) {
      setUser((prevUserDetails) => ({
        ...prevUserDetails,
        picture: files[0],
      }));
      setSelectedImage(URL.createObjectURL(files[0]));
    } else {
      setUser((prevUserDetails) => ({
        ...prevUserDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.firstname) {
      showErrorWithTimeout("Please Enter Your firstname", 3000);
      return;
    }
    if (!user.lastname) {
      showErrorWithTimeout("Please Enter Your lastname", 3000);
      return;
    }
    if (!user.email) {
      showErrorWithTimeout("Please Enter Your Email", 3000);
      return;
    }
    if (!user.phone) {
      showErrorWithTimeout("Please Enter Your Phone", 3000);
      return;
    }
    // if (!user.phonenumber) {
    //   showErrorWithTimeout("Please Enter Your Phone", 3000);
    //   return;
    // }
    if (!user.password) {
      showErrorWithTimeout("Please Enter Your Password", 3000);
      return;
    }
    if (user.cpassword !== user.password) {
      showErrorWithTimeout(
        "Password and Confirm Password does not match",
        3000
      );
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstname", user.firstname);
      formData.append("lastname", user.lastname);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      // formData.append("phonenumber", user.phonenumber);
      formData.append("password", user.password);
      formData.append("picture", user.picture);

      const res = await axios.post(
        `${process.env.REACT_APP_API}/signup`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (!!res) {
        setLoading(false);
        navigate("/sign-in");
        toast.success(res.data.message);
        setTimeout(() => {
          toast.warn("Check your email for a verification link.");
        }, 1000);
      } else {
        showErrorWithTimeout("Unable to Register", 3000);
      }
    } catch (error: any) {
      setLoading(false);
      showErrorWithTimeout(error.response.data.message, 3000);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        {!loading ? (
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
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                {error && (
                  <Typography marginY={1} textAlign={"center"} color="error">
                    <b>Error:</b> {error}
                  </Typography>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstname"
                      fullWidth
                      id="firstname"
                      label="First Name"
                      autoFocus
                      value={user.firstname}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="family-name"
                      name="lastname"
                      fullWidth
                      id="lastname"
                      label="Last Name"
                      value={user.lastname}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={user.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MuiPhoneNumber
                      defaultCountry={"in"}
                      variant="outlined"
                      name="phone"
                      value={user.phone}
                      onChange={(value) =>
                        handleChange({ target: { name: "phone", value } })
                      }
                      style={{ width: "100%" }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phonenumber"
                      label="Phone Number"
                      name="phonenumber"
                      autoComplete="phonenumber"
                      value={user.phonenumber}
                      onChange={handleChange}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={user.password}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="cpassword"
                      label="Confirm Password"
                      type="password"
                      id="cpassword"
                      autoComplete="confirm-password"
                      value={user.cpassword}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="picture"
                      type="file"
                      id="picture"
                      autoComplete="picture"
                      inputProps={{
                        multiple: false,
                      }}
                      onChange={(e) => handleChange(e, "picture")}
                      inputRef={inputRef}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {selectedImage && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={
                            typeof selectedImage === "string"
                              ? selectedImage
                              : ""
                          }
                          alt="Selected "
                          style={{
                            maxWidth: "100%",
                            maxHeight: "80px",
                            // borderRadius: "50%",
                          }}
                        />
                        <IconButton color="primary" onClick={removeImage}>
                          <Delete />
                        </IconButton>
                      </div>
                    )}
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => handleSubmit}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link to="/sign-in">Already have an account? Sign in</Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Paper>
        ) : (
          <Loader height={height} width={width} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
