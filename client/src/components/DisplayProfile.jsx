import { Avatar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import "../style/DisplayProfile.css";

const DisplayProfile = () => {
  const user = useSelector((state) => state.user.data);
  return (
    <div className="user-profile-outer">
      <div className="user-profile-img">
        <Avatar
          alt={user.name}
          style={{ height: "20%", width: "20%" }}
          src={user.photo}
        />
      </div>
    </div>
  );
};

export default DisplayProfile;
