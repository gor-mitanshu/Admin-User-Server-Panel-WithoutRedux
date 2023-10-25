import React, { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Zoom,
} from "@mui/material";
import { Dashboard, Key, Logout, Person } from "@mui/icons-material";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../ProtectedRoute/AuthContext";

const Sidebar = (): JSX.Element => {
  const [id, setId] = useState();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/loggeduser`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (!!res && res.data.data._id) {
            setId(res.data.data._id);
          } else {
            console.log("Id not found");
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

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/sign-in");
    toast.success("Logged Out Successfully");
  };
  return (
    <>
      <Grid className="sidebar">
        <Grid item lg={12} sm={6} xs={3}>
          <Toolbar />
          <Divider />

          <NavLink to={"/dashboard"} className={"link"}>
            <ListItem disablePadding className="sidebar-item">
              <Tooltip
                title={"Dashboard"}
                arrow
                TransitionComponent={Zoom}
                enterDelay={800}
                leaveDelay={200}
                placement="bottom"
              >
                <ListItemButton className="sidebar-listitem-btn">
                  <ListItemIcon className="sidebar-icon">
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </NavLink>
          <Divider />

          <NavLink to={"/profile"} className={"link"}>
            <ListItem disablePadding className="sidebar-item">
              <Tooltip
                title={"Profile"}
                arrow
                TransitionComponent={Zoom}
                enterDelay={800}
                leaveDelay={200}
                placement="bottom"
              >
                <ListItemButton className="sidebar-listitem-btn">
                  <ListItemIcon className="sidebar-icon">
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profile"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </NavLink>
          <Divider />

          {/* <NavLink to={"/users"} className={"link"}>
            <ListItem disablePadding className="sidebar-item">
              <Tooltip
                title={"Users"}
                arrow
                TransitionComponent={Zoom}
                enterDelay={800}
                leaveDelay={200}
                placement="bottom"
              >
                <ListItemButton className="sidebar-listitem-btn">
                  <ListItemIcon className="sidebar-icon">
                    <Person2TwoTone />
                  </ListItemIcon>
                  <ListItemText primary="Users" sx={{ whiteSpace: "nowrap" }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </NavLink>
          <Divider /> */}

          <NavLink to={`/changepassword/${id}`} className={"link"}>
            <ListItem disablePadding className="sidebar-item">
              <Tooltip
                title={"Change Password"}
                arrow
                TransitionComponent={Zoom}
                enterDelay={800}
                leaveDelay={200}
                placement="bottom"
              >
                <ListItemButton className="sidebar-listitem-btn">
                  <ListItemIcon className="sidebar-icon">
                    <Key />
                  </ListItemIcon>
                  <ListItemText
                    primary="Change Password"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </NavLink>
          <Divider />

          <ListItem disablePadding className="sidebar-item logout">
            <Tooltip
              title={"Logout"}
              arrow
              TransitionComponent={Zoom}
              enterDelay={800}
              leaveDelay={200}
              placement="bottom"
            >
              <ListItemButton
                className="sidebar-listitem-btn"
                onClick={handleLogout}
              >
                <ListItemIcon className="sidebar-icon">
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ whiteSpace: "nowrap" }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};

export default Sidebar;
