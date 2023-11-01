import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Avatar, Typography, Button, Grid } from "@mui/material";
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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/loggedadmin`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (!!res) {
            setLoading(false);
            setUser(res.data.data);
          } else {
            console.log("User not found");
          }
        } else {
          setLoading(false);
          console.log("error");
        }
      } catch (error: any) {
        setLoading(false);
        console.log(error.response.data.message);
      }
    };
    getUser();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <Typography
            textAlign={"center"}
            className="font"
            color="black"
            variant="h3"
            paddingBottom={3}
          >
            Profile
          </Typography>
          <Grid container display={"flex"} justifyContent={"center"}>
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
                  {user?.picture ? (
                    <Avatar
                      src={`${process.env.REACT_APP_API}/${user?.picture}`}
                      alt={user?.firstname
                        .concat(".", user?.lastname)
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
                  ) : null}
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
              ""
            )}
          </Grid>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Profile;
