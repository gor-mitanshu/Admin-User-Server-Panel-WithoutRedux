import React, { useState, useEffect } from "react";
import { Button, Typography, Avatar, Grid } from "@mui/material";
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
  status: string;
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
        console.log(error.response.data.message);
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
      <Typography className="font" color="black" variant="h3" paddingBottom={3}>
        User Details
      </Typography>
      <Grid
        container
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        {user ? (
          <Grid item xs={11} sm={10} lg={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: "10px",
              }}
            >
              <ArrowBack
                fontSize="large"
                onClick={() => navigate(`/users`)}
                style={{ cursor: "pointer" }}
              />
              <Button
                variant="contained"
                color="error"
                onClick={openComposeModal}
              >
                Compose
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexWrap: "wrap",
                paddingTop: "40px",
                paddingBottom: "40px",
                borderRadius: "6px",
                background:
                  user.status === "active"
                    ? "rgba(0, 128, 0, 0.2)"
                    : "rgba(255, 0, 0, 0.2)",
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
                    // border: "1px solid black",
                  }}
                  // style={{ backgroundColor: getRandomColor() }}
                />
                {user.picture !== "" && (
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
                )}
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
                <Typography variant="body1" marginBottom={2}>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      // backgroundColor:
                      //   user?.status === "active"
                      //     ? "rgba(0, 128, 0, 0.4)"
                      //     : user?.status === "inactive"
                      //     ? "rgba(255, 0, 0, 0.4)"
                      //     : "inherit",
                      color:
                        user?.status === "active"
                          ? "rgb(43,182,115)"
                          : user?.status === "inactive"
                          ? "rgb(255,0,0)"
                          : "inherit",
                      fontWeight:
                        user?.status === "active" || user?.status === "inactive"
                          ? 700
                          : "inherit",
                    }}
                  >
                    {user?.status.toUpperCase()}
                  </span>
                </Typography>
              </div>
            </div>
          </Grid>
        ) : (
          <Loader />
        )}
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
