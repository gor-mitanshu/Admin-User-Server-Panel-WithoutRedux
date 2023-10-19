import React from "react";
import "../Dashboard/DashboardPage.css";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

const Dashboard = (): JSX.Element => {
  return (
    <>
      <Grid container padding={2} spacing={1}>
        <Grid item lg={3} md={6} sm={12} xs={12}>
          <Card className="card card-1">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Card 1
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  Lorem ipsum dolor sit
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12}>
          <Card className="card card-2">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Card 2
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  Lorem ipsum dolor sit
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12}>
          <Card className="card card-3">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Card 3
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  Lorem ipsum dolor sit
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>
        <Grid item lg={3} md={6} sm={12} xs={12}>
          <Card className="card card-4">
            <Box className="card-box" />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography
                  component="div"
                  variant="h5"
                  sx={{ fontSize: "2rem", position: "relative", zIndex: 1 }}
                >
                  Card 4
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="#fff"
                  component="div"
                  sx={{ position: "relative", zIndex: 1 }}
                >
                  Lorem ipsum dolor sit
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
