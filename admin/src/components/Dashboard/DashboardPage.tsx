import React, { useEffect, useState } from "react";
import "../Dashboard/DashboardPage.css";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import EChart from "../Chart/EChartData";
import axios from "axios";

const Dashboard = (): JSX.Element => {
  const [userCounts, setUserCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API}/getUsers`);
        const users = res.data.data;

        const activeUsers = users.filter(
          (user: any) => user.status === "active"
        );
        const inactiveUsers = users.filter(
          (user: any) => user.status === "inactive"
        );

        setUserCounts({
          total: users.length,
          active: activeUsers.length,
          inactive: inactiveUsers.length,
        });
      } catch (error: any) {
        console.log(error.data.data.message);
      }
    };

    getUsers();
  }, []);
  return (
    <>
      <Grid container padding={2} spacing={1}>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Card className="card card-active">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  textAlign={"center"}
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Total Active Users
                </Typography>
                <Typography
                  textAlign={"center"}
                  variant="h5"
                  color="black"
                  component="div"
                  sx={{ position: "relative" }}
                >
                  {userCounts.active}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Card className="card card-inactive">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  textAlign={"center"}
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Total Inactive Users
                </Typography>
                <Typography
                  textAlign={"center"}
                  variant="h5"
                  color="black"
                  component="div"
                  sx={{ position: "relative" }}
                >
                  {userCounts.inactive}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Card className="card card-total-users">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  textAlign={"center"}
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Total Users
                </Typography>
                <Typography
                  textAlign={"center"}
                  variant="h5"
                  color="black"
                  component="div"
                  sx={{ position: "relative" }}
                >
                  {userCounts.total}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Grid padding={2}>
        <EChart />
      </Grid>
    </>
  );
};

export default Dashboard;
