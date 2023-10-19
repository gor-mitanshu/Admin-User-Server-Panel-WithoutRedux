import React from "react";
import "./style.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/Authentication/Login/Login";
import SignUp from "./components/Authentication/Register/Register";
import ForgetPassword from "./components/Authentication/ForgetPassword/ForgetPassword";
import ResetPassword from "./components/Authentication/ChangePassword/ChangePassword";
import Layout from "./components/Layout/Layout/Layout";
import Dashboard from "./components/Dashboard/DashboardPage";
import Profile from "./components/Profile/Profile";
import UpdateProfile from "./components/Profile/UpdateProfile";
import SideChangePassword from "./components/SidebarChangePassword/SideChangePassword";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const ProtectedRoutes = ProtectedRoute();
  return (
    <div className="App">
      <Routes>
        <Route path={"/sign-in"} element={<SignIn />} />
        <Route path={"/sign-up"} element={<SignUp />} />
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
            path={"/changepassword/:id"}
            element={
              <ProtectedRoutes>
                <SideChangePassword />
              </ProtectedRoutes>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
