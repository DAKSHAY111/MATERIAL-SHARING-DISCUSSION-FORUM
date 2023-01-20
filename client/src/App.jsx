import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavbarHeader from "./Components/NavbarHeader";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Response from "./Pages/Response";
import HomePage from "./Pages/HomePage";

import { AppContext } from "./Context/AppContext";

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

          <Route path="/response" element={<Response />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;