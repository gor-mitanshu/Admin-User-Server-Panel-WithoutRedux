import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.css";
import axios from "axios";

const Navbar = ({ toogleSidebar }: any): JSX.Element => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const toogleSiderbar = () => {
    setOpen(!isOpen);
    toogleSidebar(isOpen);
  };

  const [user, setUser] = useState<string>("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/loggedUser`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (res && res.data.data) {
            setUser(res.data.data.firstname);
          }
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };

    getUserData();
  }, []);
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
            <Typography className="navbar-title ellipsis">{user}</Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
