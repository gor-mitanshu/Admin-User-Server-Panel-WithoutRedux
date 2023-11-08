import React, { useState, useEffect } from "react";
import { AppBar, Avatar, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.css";
import axios from "axios";

const Navbar = ({ toogleSidebar }: any): JSX.Element => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const toogleSiderbar = () => {
    setOpen(!isOpen);
    toogleSidebar(isOpen);
  };

  const [admin, setAdmin] = useState<any>("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/loggedadmin`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (res && res.data.data) {
            setAdmin(res.data.data);
          }
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };

    getUserData();
  }, [admin.firstname, admin.picture]);
  return (
    <div>
      <AppBar className="appbar">
        <Toolbar className="toolbar-navbar">
          <MenuIcon className="menu-icon" onClick={toogleSiderbar} />
          {/* <Grid className="navbar-name-content-center">
              <Typography className="navbar-title">Panel</Typography>
            </Grid> */}
          <div
            className="justify-end justify-center"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {admin?.picture ? (
              <Avatar
                src={`${process.env.REACT_APP_API}/${admin?.picture}`}
                alt={admin?.firstname
                  .concat(".", admin?.lastname)
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")
                  .toUpperCase()}
                sx={{
                  width: "40px",
                  height: "40px",
                  // margin: "0 auto 20px",
                }}
              />
            ) : null}
            <Typography className="navbar-title ellipsis">
              {admin.firstname}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
