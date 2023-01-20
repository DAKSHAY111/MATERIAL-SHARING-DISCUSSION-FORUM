import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavbarHeader from "./components/NavbarHeader";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Response from "./pages/Response";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";

import { AppContext } from "./context/AppContext";

import "./App.css";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user);

  return (
    <AppContext.Provider value={{ user }}>
      <BrowserRouter>
        <NavbarHeader />
        <Routes>
          {user && <Route path="/" element={<HomePage />} />}
          {!user && <Route path="/" element={<Login />} />}

          {!user && <Route path="/signup" element={<Signup />} />}
          {user && <Route path="/signup" element={<HomePage />} />}

          {!user && <Route path="/login" element={<Login />} />}
          {user && <Route path="/login" element={<HomePage />} />}

          <Route path="/forgot" element={<ForgotPassword />} />

          <Route path="/response" element={<Response />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;