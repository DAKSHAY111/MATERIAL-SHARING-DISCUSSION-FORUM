import { Button, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useFetchPostWithOptionsMutation, useFetchUserDataMutation } from "../services/appApi";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

import "../style/DisplayProfile.css";
import { useNavigate } from "react-router-dom";

const DisplayProfile = () => {
  const user = useSelector((state) => state.user.data);

  const [options, setOptions] = useState("recent_material");
  const [optionsResult, setOptionResult] = useState([]);

  const navigate = useNavigate();
  const [fetchPostWithOptionsFunction] = useFetchPostWithOptionsMutation();
  const [updateDataFunction] = useFetchUserDataMutation();

  useEffect(() => {
    fetchPostWithOptionsFunction({
      options,
    }).then(({ data, error }) => {
      if (error) {
      } else {
        setOptionResult(data);
      }
    });
  }, [options, fetchPostWithOptionsFunction]);

  useEffect(() => {
    updateDataFunction().then(({ data, error }) => {
      console.log(data);
      console.log(error);
    });
  }, [updateDataFunction]);

  return (
    <div className="user-profile-outer">
      <div className="user-profile-upper">
        <div className="user-profile-top-i">
          <div className="user-profile-top-i-inner">
            <div className="user-profile-img">
              <img alt={user?.name} src={user?.photo} id="user-profile-picture" />
            </div>
            <div className="user-name-div">
              <div className="user-display-name">
                {user?.displayName[0].toUpperCase() + user?.displayName.substr(1)}
              </div>
              <div className="user-name">{user?.name}</div>
            </div>
          </div>
          <div className="users-about">
            {user?.about}
          </div>
          <Button
            className="custom_btn active edit-profile-btn"
            variant="text"
            color="info"
          >
            Edit Profile
          </Button>
          <div className="community-stats">
            <div className="title">
              Community Stats
            </div>
            <div className="stats-info">
              <Chip className="stats-chip" label={`${user?.materialCount} Material Uploaded`} />
              <Chip className="stats-chip" label={`${user?.doubtsCount} Doubts Posted`} />
              <Chip className="stats-chip" label={`${user?.repliesCount} Replied to Doubts`} />
              <Chip className="stats-chip" label={`${(user?.reputation > 0 ? '+' : "") +  user?.reputation} Reputation Earned`} />
            </div>
          </div>
        </div>
      </div>
      <div className="user-profile-lower">
        <div className="lower-navigation">
          <div className="btn-group">
            <Button
              onClick={() => setOptions("recent_material")}
              variant="text"
              className={`custom_btn ${
                options === "recent_material" ? "active" : ""
              }`}
              startIcon={<ListAltRoundedIcon />}
            >
              Recent Material
            </Button>
            <Button
              onClick={() => setOptions("recent_doubts")}
              variant="text"
              className={`custom_btn ${
                options === "recent_doubts" ? "active" : ""
              }`}
              startIcon={<HelpOutlineRoundedIcon />}
            >
              Recent Doubts
            </Button>
            <Button
              onClick={() => setOptions("recent_replies")}
              variant="text"
              className={`custom_btn ${
                options === "recent_replies" ? "active" : ""
              }`}
              startIcon={<FactCheckOutlinedIcon />}
            >
              Recent Replies
            </Button>
          </div>
          <div className="navigation_link">
            <Button
              onClick={() => navigate("/discuss")}
              className="custom_btn"
              endIcon={<SendRoundedIcon />}
            >
              Go to Discuss
            </Button>
          </div>
        </div>
        <div className="lower_option_render">
          <div className="lower_insider">
            {optionsResult.map((element, idx) => (
              <div className="options_outer" key={idx}>
                <div className="post_title">{element.title}</div>
                {Math.floor(
                  Math.abs(Date.now() - Date.parse(element.createdAt)) /
                    (1000 * 60)
                ) < 60 ? (
                  <div className="posted_time">{`${Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60)
                  )} minutes ago`}</div>
                ) : Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60)
                  ) < 24 ? (
                  <div className="posted_time">{`${Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60)
                  )} Hours ago`}</div>
                ) : Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60 * 24)
                  ) < 30 ? (
                  <div className="posted_time">{`${Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60 * 24)
                  )} Days ago`}</div>
                ) : Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60 * 24 * 30)
                  ) < 12 ? (
                  <div className="posted_time">{`${Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60 * 24 * 30)
                  )} Months ago`}</div>
                ) : (
                  <div className="posted_time">{`${Math.floor(
                    Math.abs(Date.now() - Date.parse(element.createdAt)) /
                      (1000 * 60 * 60 * 24 * 30 * 12)
                  )} Years ago`}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayProfile;
