import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavbarHeader from "./components/NavbarHeader";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Response from "./pages/Response";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreatePost from "./components/CreatePost";

import { AppContext } from "./context/AppContext";

import "./App.css";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile";

function App() {
  const user = useSelector((state) => state.user);

  return (
    <AppContext.Provider value={{ user }}>
      <BrowserRouter>
        <NavbarHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {!user && <Route path="/signup" element={<Signup />} />}
          {user && <Route path="/signup" element={<HomePage />} />}

          {!user && <Route path="/login" element={<Login />} />}
          {user && <Route path="/login" element={<HomePage />} />}

          {!user && <Route path="/create/file" element={<Login />} />}
          {user && <Route path="/create/file" element={<CreatePost />} />}

          {user && <Route path="/account" element={<Profile />} />}
          {!user && <Route path="/account" element={<Login />} />}

          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/new/password" element={<ResetPassword />} />

          <Route path="/response" element={<Response />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;