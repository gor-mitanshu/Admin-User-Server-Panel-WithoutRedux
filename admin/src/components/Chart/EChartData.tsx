import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import axios from "axios";

interface IUsers {
  active: number;
  inactive: number;
}
const EChart = () => {
  const [chartData, setChartData] = useState<IUsers | any>({
    active: 0,
    inactive: 0,
  });

  const categories = ["active", "inactive"];

  const getUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/getUsers`);
      const users = res.data.data;
      const totalUsers = {
        active: 0,
        inactive: 0,
      };

      users.forEach((user: any) => {
        if (user.status === "active") {
          totalUsers.active++;
        } else if (user.status === "inactive") {
          totalUsers.inactive++;
        }
      });

      setChartData(totalUsers);
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const options = {
    darkMode: "auto",
    title: {
      text: "Active & Inactive Users",
      subtext: "Users",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: categories.map((category) => category.toUpperCase()),
    },
    series: [
      {
        name: "Users",
        type: "pie",
        radius: "50%",
        data: categories.map((category: any) => ({
          value: chartData[category],
          name: category.toUpperCase(),
          itemStyle: {
            color:
              category === "active" ? "rgb(145,196,149)" : "rgb(247,145,149)",
            border: category === "active" ? "green" : "red",
          },
        })),
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactEcharts
          option={options}
          style={{ height: "60vh", width: "100%" }}
        />
      </Card>
    </div>
  );
};

export default EChart;
