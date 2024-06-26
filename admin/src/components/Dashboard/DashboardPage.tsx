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
    const fetchUserCounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/getUserCounts`
        );
        const { data } = response.data;

        const updateCounts = () => {
          setUserCounts((prevCounts) => ({
            total:
              prevCounts.total < data.total ? prevCounts.total + 1 : data.total,
            active:
              prevCounts.active < data.active
                ? prevCounts.active + 1
                : data.active,
            inactive:
              prevCounts.inactive < data.inactive
                ? prevCounts.inactive + 1
                : data.inactive,
          }));
        };

        const interval = animationDuration / Math.max(data.total, 1);
        let step = 0;

        const animation = setInterval(() => {
          updateCounts();
          step++;
          if (step >= data.total) {
            clearInterval(animation);
          }
        }, interval);
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };

    fetchUserCounts();
  }, []);

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
