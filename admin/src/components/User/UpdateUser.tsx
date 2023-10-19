import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

interface IUser {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  picture: string;
}

const UpdateUser = () => {
  const pictureInputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [initialPicture, setInitialPicture] = useState<string>("");
  const [imageChanged, setImageChanged] = useState(false);
  const [editedUser, setEditedUser] = useState<IUser>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    picture: "",
  });

  useEffect(() => {
    const getUser = async () => {
      axios
        .get(`${process.env.REACT_APP_API}/getUser/${id}`)
        .then((response) => {
          const userData = response.data.data;
          setEditedUser(userData);
          setInitialPicture(userData.picture);
        });
    };
    getUser();
  }, [id]);

  const showErrorWithTimeout = (errorMessage: string, timeout: number) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, timeout);
  };

  const handleChange = (e: any, field?: string) => {
    const { name, value, files } = e.target;
    if (field === "picture" && files.length > 0) {
      setEditedUser((prevUserDetails) => ({
        ...prevUserDetails,
        picture: files[0],
      }));
      setImageChanged(true);
    } else {
      setEditedUser((prevUserDetails) => ({
        ...prevUserDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editedUser.firstname) {
      showErrorWithTimeout("Please Enter Your firstname", 3000);
      return;
    }
    if (!editedUser.lastname) {
      showErrorWithTimeout("Please Enter Your lastname", 3000);
      return;
    }
    if (!editedUser.email) {
      showErrorWithTimeout("Please Enter Your Email", 3000);
      return;
    }
    if (!editedUser.phone) {
      showErrorWithTimeout("Please Enter Your Phone", 3000);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("firstname", editedUser.firstname);
      formData.append("lastname", editedUser.lastname);
      formData.append("email", editedUser.email);
      formData.append("phone", editedUser.phone);

      if (imageChanged) {
        formData.append("picture", editedUser.picture);
      } else {
        formData.append("picture", initialPicture);
      }

      const res = await axios.put(
        `${process.env.REACT_APP_API}/updateUser/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res) {
        navigate(`/users`);
        toast.success("User Updated Successfully");
      } else {
        showErrorWithTimeout("Unable to edit", 3000);
        return;
      }
    } catch (error: any) {
      showErrorWithTimeout(error.message, 3000);
      return;
    }
  };

  return (
    <Grid container padding={2} display={"flex"} flexDirection={"column"}>
      <Typography className="font" color="black" variant="h3" paddingBottom={3}>
        Update Users Details
      </Typography>
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
        xs={12}
        lg={6}
      >
        {editedUser ? (
          <Paper
            elevation={3}
            style={{
              padding: "20px 0",
              width: "100%",
              background: "rgb(0 0 0 / 10%)",
              // color: "white",
            }}
          >
            {editedUser ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexWrap: "wrap",
                    padding: "20px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <Avatar
                      src={
                        editedUser.picture
                          ? `${process.env.REACT_APP_API}/${editedUser?.picture}`
                          : ""
                      }
                      alt="User"
                      sx={{
                        width: "150px",
                        height: "150px",
                        marginBottom: "10px",
                        border: "2px solid black",
                      }}
                    />
                    <Button
                      type="button"
                      color="info"
                      size="large"
                      variant="outlined"
                      onClick={() => {
                        if (pictureInputRef.current) {
                          pictureInputRef.current.click();
                        }
                      }}
                      // onChange={(e) => handleChange(e, "picture")}
                    >
                      Change Image
                    </Button>
                    <input
                      type="file"
                      name="picture"
                      accept="image/*"
                      ref={pictureInputRef}
                      style={{ display: "none" }}
                      onChange={(e) => handleChange(e, "picture")}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    {error && (
                      <Typography
                        marginY={1}
                        textAlign={"center"}
                        color="error"
                      >
                        <b>Error:</b> {error}
                      </Typography>
                    )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstname"
                          value={editedUser?.firstname}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastname"
                          value={editedUser?.lastname}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={editedUser?.email}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={editedUser?.phone}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        style={{ marginTop: "20px", marginRight: "5px" }}
                        onClick={() => navigate("/users")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ marginTop: "20px" }}
                        onClick={(e: any) => handleSubmit(e)}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Typography variant="h5" color="error">
                No Data Found
              </Typography>
            )}
          </Paper>
        ) : (
          <Loader />
        )}
      </Grid>
    </Grid>
  );
};

export default UpdateUser;
