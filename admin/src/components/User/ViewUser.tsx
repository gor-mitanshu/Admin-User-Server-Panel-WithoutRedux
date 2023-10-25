import React, { useState, useEffect } from "react";
import { Button, Paper, Typography, Avatar, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import "./style.css";
import ComposeEmailModal from "./ComposeEmailModal";
import Loader from "../Loader/Loader";

interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  picture: string;
}

const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [adminuser, setAdminUser] = useState<IUser | null>(null);

  const [isComposeModalOpen, setComposeModalOpen] = useState(false);

  useEffect(() => {
    const viewUser = async () => {
      if (!!id) {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/getUser/${id}`
        );
        setUser(res.data.data);
      }
    };
    viewUser();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
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
            setAdminUser(res.data.data);
          } else {
            console.log("User not found");
          }
        } else {
          console.log("error");
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);

  const openComposeModal = () => {
    setComposeModalOpen(true);
  };

  const closeComposeModal = () => {
    setComposeModalOpen(false);
  };

  return (
    <>
      <Grid container padding={2} display={"flex"} flexDirection={"column"}>
        <Typography
          className="font"
          color="black"
          variant="h3"
          paddingBottom={3}
        >
          Users Details
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
          {user ? (
            <Paper
              elevation={3}
              style={{
                padding: "20px 0",
                width: "100%",
                background: "rgb(0 0 0 / 10%)",
                // color: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  paddingBottom: "20px",
                }}
              >
                <ArrowBack
                  fontSize="large"
                  onClick={() => navigate(`/users`)}
                  style={{ cursor: "pointer" }}
                />
                <Paper elevation={8} sx={{ marginRight: "10px" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={openComposeModal}
                  >
                    Compose
                  </Button>
                </Paper>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar
                    src={
                      user?.picture
                        ? `${process.env.REACT_APP_API}/${user?.picture}`
                        : ""
                    }
                    alt={user.firstname
                      .concat(".", user.lastname)
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")
                      .toUpperCase()}
                    sx={{
                      width: "150px",
                      height: "150px",
                      marginBottom: "10px",
                      border: "1px solid black",
                    }}
                  />
                  <Link
                    to={`${process.env.REACT_APP_API}/${user?.picture}`}
                    target="_blank"
                  >
                    <Button
                      type="button"
                      // color="info"
                      sx={{ color: "black", borderColor: "black" }}
                      size="large"
                      variant="outlined"
                    >
                      View Image
                    </Button>
                  </Link>
                </div>
                <div>
                  <Typography variant="h4" marginBottom={2}>
                    {user?.firstname} {user?.lastname}
                  </Typography>
                  <Typography variant="body1" marginBottom={2}>
                    <b>Email:</b> {user?.email}
                  </Typography>
                  <Typography variant="body1" marginBottom={2}>
                    <b>Phone:</b> {user?.phone}
                  </Typography>
                </div>
              </div>
            </Paper>
          ) : (
            <div style={{ width: "100%" }}>
              <Loader />
            </div>
          )}
        </Grid>
      </Grid>

      {/* Compose Email Modal */}
      <ComposeEmailModal
        open={isComposeModalOpen}
        onClose={closeComposeModal}
        to={user?.email || ""}
        from={adminuser?.email || ""}
      />
    </>
  );
};

export default ViewUser;
