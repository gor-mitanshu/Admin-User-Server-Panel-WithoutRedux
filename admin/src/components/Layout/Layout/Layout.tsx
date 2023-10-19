import { Grid } from "@mui/material";
import React, { useState } from "react";
import "../Layout/Layout.css";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const Layout = (): JSX.Element => {
  const [isOpen, setIsClose] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsClose((toogle) => !toogle);
  };
  return (
    <div>
      <Grid className="layout">
        <Grid className={isOpen ? "layout-sidebar" : "layout-sidebar-sm"}>
          <Sidebar />
        </Grid>
        <Grid className="layout-navbar">
          <Navbar toogleSidebar={toggleSidebar} />
        </Grid>
        <Grid className="outlet">
          <Outlet />
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
