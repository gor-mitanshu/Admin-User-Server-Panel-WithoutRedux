import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Avatar, Typography, Button, Paper, Grid } from "@mui/material";
import Loader from "../Loader/Loader";

interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  picture: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/user/loggeduser`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (!!res) {
            setUser(res.data.data);
          } else {
            console.log("User not found");
          }
        } else {
          console.log("error");
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Grid container padding={2} display={"flex"} flexDirection={"column"}>
        <Typography
          className="font"
          color="black"
          variant="h3"
          paddingBottom={3}
        >
          Profile
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
          lg={4}
        >
          {user ? (
            <Paper elevation={3} style={{ padding: "20px", width: "100%" }}>
              {user !== undefined ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_API}/${user?.picture}`}
                      alt={user.firstname
                        .concat(".", user.lastname)
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")
                        .toUpperCase()}
                      sx={{
                        width: "150px",
                        height: "150px",
                        margin: "0 auto 20px",
                      }}
                    />
                    <Typography variant="h4" gutterBottom>
                      {user?.firstname} {user?.lastname}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <b>Email:</b> {user?.email}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <b>Phone:</b> {user?.phone}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{ marginTop: "10px", width: "100%" }}
                      onClick={() => navigate(`/update/${user?._id}`)}
                    >
                      Update
                    </Button>
                  </div>
                </>
              ) : (
                <Typography variant="h5" color="error">
                  No Data Found
                </Typography>
              )}
            </Paper>
          ) : (
            <div style={{ width: "100%" }}>
              <Loader />
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
