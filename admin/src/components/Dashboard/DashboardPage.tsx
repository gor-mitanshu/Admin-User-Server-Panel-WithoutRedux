import React, { useEffect, useState } from "react";
import "../Dashboard/DashboardPage.css";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import EChart from "../Chart/EChartData";
import axios from "axios";
import { Block, Check, Group } from "@mui/icons-material";

const Dashboard = (): JSX.Element => {
  const [userCounts, setUserCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const animationDuration = 800;
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

        const updateCounts = () => {
          const total = users.length;
          const active = activeUsers.length;
          const inactive = inactiveUsers.length;

          setUserCounts((prevCounts) => ({
            total: prevCounts.total < total ? prevCounts.total + 1 : total,
            active: prevCounts.active < active ? prevCounts.active + 1 : active,
            inactive:
              prevCounts.inactive < inactive
                ? prevCounts.inactive + 1
                : inactive,
          }));
        };
        const interval = animationDuration / Math.max(users.length, 1);
        let step = 0;
        const animation = setInterval(() => {
          updateCounts();
          step++;
          if (step >= users.length) {
            clearInterval(animation);
          }
        }, interval);
      } catch (error: any) {
        console.log(error.data.data.message);
      }
    };

    getUsers();
  }, [animationDuration]);

  return (
    <>
      <Grid container padding={2} spacing={1}>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Card
            elevation={4}
            sx={{
              background: "#29a744",
              color: "#fff",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem" }}
                >
                  {userCounts.active}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Check color="inherit" />
                  Active Users
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item lg={4} md={6} sm={12} xs={12}>
          <Card
            elevation={4}
            sx={{
              background: "#dc3546",
              color: "#fff",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem" }}
                >
                  {userCounts.inactive}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Block color="inherit" />
                  Inactive Users
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Card
            elevation={4}
            sx={{
              background: "#f8c12b",
              color: "#fff",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem" }}
                >
                  {userCounts.total}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Group color="inherit" />
                  Total Users
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
