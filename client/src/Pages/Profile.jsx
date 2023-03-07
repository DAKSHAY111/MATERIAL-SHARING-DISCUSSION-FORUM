import React from "react";
import { useSelector } from "react-redux";

import "../style/Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.user.data);
  return (
    <div className="profile-outer">
      <div className="profile-wrapper">
        <div className="left-hand-menu">
          <div className="nav-outer">{user.name}'s Profile</div>
          <div className="nav-outer">Edit Profile</div>
          <div className="nav-outer">Material Posted</div>
          <div className="nav-outer">Replies to Posts</div>
          <div className="nav-outer">Doubts Posted</div>
        </div>
        <div className="right-hand-side"></div>
      </div>
    </div>
  );
};

export default Profile;
