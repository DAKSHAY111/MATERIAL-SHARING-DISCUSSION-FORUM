import EditRounded from "@mui/icons-material/EditRounded";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import ListAltRounded from "@mui/icons-material/ListAltRounded";
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
          <Button onClick={() => setStatus("/edit_profile")} className={`custom_btn ${status === "/edit_profile" ? "active" : ""}`} startIcon={<EditRounded />}>
            Edit Profile
          </Button>
          <Button onClick={() => setStatus("/my_material")} className={`custom_btn ${status === "/my_material" ? "active" : ""}`} startIcon={<ListAltRounded />}>
            My Material
          </Button>
          <Button onClick={() => setStatus("/favourites")} className={`custom_btn ${status === "/favourites" ? "active" : ""}`} startIcon={<FavoriteRounded />}>
            Favourites
          </Button>
          <Button onClick={() => setStatus("/doubts")} className={`custom_btn ${status === "/doubts" ? "active" : ""}`} startIcon={<HelpOutlineRounded />}>
            Doubts
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
