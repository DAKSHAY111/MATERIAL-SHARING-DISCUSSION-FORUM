import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
// import { UserContextProvider } from "./context/UserContext";
import PageNotFound from "./pages/PageNotFound";

const Routing = () => {
  return (
    <Routes>
      <Route exact path="/signup" component={Signup} />
      <Route path="*" component={PageNotFound} />
    </Routes>
  );
};

const App = () => {
  return (
    <>
      {/* <UserContextProvider> */}
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
      {/* </UserContextProvider> */}
    </>
  );
};

export default App;
