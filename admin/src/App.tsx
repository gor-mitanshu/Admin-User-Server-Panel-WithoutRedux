import React from "react";
import "./style.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SignIn from "./components/Authentication/Login/Login";
import ForgetPassword from "./components/Authentication/ForgetPassword/ForgetPassword";
import ResetPassword from "./components/Authentication/ChangePassword/ChangePassword";
import Layout from "./components/Layout/Layout/Layout";
import { Dashboard } from "@mui/icons-material";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/Profile/UpdateProfile";
import Users from "./components/User/Users";
import UpdateUser from "./components/User/UpdateUser";
import ViewUser from "./components/User/ViewUser";
import SidebarChangePassword from "./components/SidebarChangePassword/SideChangePassword";

function App() {
  const ProtectedRoutes = ProtectedRoute();
  return (
    <div className="App">
      <Routes>
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path={"/forget-password"} element={<ForgetPassword />} />
        <Route
          path={"/reset-password/:id/:token"}
          element={<ResetPassword />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path={"/dashboard"}
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path={"/profile"}
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
            path={"/update/:id"}
            element={
              <ProtectedRoutes>
                <UpdateProfile />
              </ProtectedRoutes>
            }
          />
          <Route
            path={"/users"}
            element={
              <ProtectedRoutes>
                <Users />
              </ProtectedRoutes>
            }
          />
          <Route
            path={"/users/update-user/:id"}
            element={
              <ProtectedRoutes>
                <UpdateUser />
              </ProtectedRoutes>
            }
          />
          <Route
            path={"/users/view-user/:id"}
            element={
              <ProtectedRoutes>
                <ViewUser />
              </ProtectedRoutes>
            }
          />
          <Route
            path={"/changepassword/:id"}
            element={
              <ProtectedRoutes>
                <SidebarChangePassword />
              </ProtectedRoutes>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
