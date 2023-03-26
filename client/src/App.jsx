import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Response from "./pages/Response";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreatePost from "./components/CreatePost";

import { AppContext } from "./context/AppContext";
import { useSelector } from "react-redux";

import Sidebar from "./components/Sidebar";

import "./App.css";
import DisplayProfile from "./components/DisplayProfile";
import DisplayFavourites from "./components/DisplayFavourites";
import Discuss from "./pages/Discuss";
import EditProfile from "./components/EditProfile";
import DisplayDoubt from "./pages/DisplayDoubt";

function App() {
  const user = useSelector((state) => state?.user);
  const [status, setStatus] = useState(false);

  return (
    <AppContext.Provider value={{ user, status, setStatus }}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {!user && <Route path="/signup" element={<Signup />} />}
          {user && <Route path="/signup" element={<HomePage />} />}

          {!user && <Route path="/login" element={<Login />} />}
          {user && <Route path="/login" element={<HomePage />} />}

          {!user && <Route path="/create/file" element={<Login />} />}
          {user && <Route path="/create/file" element={<CreatePost />} />}

          {user && <Route path="/account" element={<DisplayProfile />} />}
          {!user && <Route path="/account" element={<Login />} />}

          {user && <Route path="/starred" element={<DisplayFavourites />} />}
          {!user && <Route path="/account" element={<Login />} />}

          {user && <Route path="/edit/profile" element={<EditProfile />} />}
          {!user && <Route path="/edit/profile" element={<Login />} />}

          <Route path="/discuss" element={<Discuss />} />
          <Route path="/doubt" element={<DisplayDoubt />} />

          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/new/password" element={<ResetPassword />} />

          <Route path="/response" element={<Response />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;