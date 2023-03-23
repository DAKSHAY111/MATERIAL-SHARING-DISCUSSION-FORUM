// import EditRounded from "@mui/icons-material/EditRounded";
// import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
// import ListAltRounded from "@mui/icons-material/ListAltRounded";
import StarIcon from "@mui/icons-material/Star";
import PersonRounded from "@mui/icons-material/PersonRounded";
import { Button } from "@mui/material";
import React, { useState } from "react";
import DisplayFavourites from "../components/DisplayFavourites";
import DisplayProfile from "../components/DisplayProfile";

import "../style/Profile.css";

const Profile = () => {
  // const user = useSelector((state) => state.user.data);
  const [status, setStatus] = useState("/account");
  
  return (
    <div className="profile-outer">
      <div className="profile_navigation_menu">
        <div className="btn-group">
          <Button onClick={() => setStatus("/account")} className={`custom_btn ${status === "/account" ? "active" : ""}`} startIcon={<PersonRounded />}>
            Profile
          </Button>
          <Button onClick={() => setStatus("/favourites")} className={`custom_btn ${status === "/favourites" ? "active" : ""}`} startIcon={<StarIcon />}>
            Starred
          </Button>
        </div>
      </div>
      <div className="profile-wrapper">
        {
          status === "/account" ? (
            <DisplayProfile />
          ) : status === "/favourites" ? (
            <DisplayFavourites />
          ) : ("")
        }
      </div>
    </div>
  );
};

export default Profile;
