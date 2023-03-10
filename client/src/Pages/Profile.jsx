import React, { useContext, useEffect } from "react";
import DisplayProfile from "../components/DisplayProfile";
import { AppContext } from "../context/AppContext";

import "../style/Profile.css";

const Profile = () => {
  // const user = useSelector((state) => state.user.data);
  const { status, setStatus } = useContext(AppContext);

  useEffect(() => {
    setStatus("/account");
  });
  
  return (
    <div className="profile-outer">
      <div className="profile-wrapper">
        {
          status === "/account" ? (
            <DisplayProfile />
          ) : ""
        }
      </div>
    </div>
  );
};

export default Profile;
