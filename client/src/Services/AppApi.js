import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavbarHeader from "./Components/NavbarHeader";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import HomePage from "./Pages/HomePage";
import Verify from "./Pages/Verify";

import { AppContext } from "./Context/AppContext";

import "./App.css";

function App() {
  return (
    <AppContext.Provider value={{}}>
      <BrowserRouter>
        <NavbarHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;