import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useFetchPostWithOptionsMutation } from "../services/appApi";

import "../style/DisplayProfile.css";
import { useNavigate } from "react-router-dom";

const DisplayProfile = () => {
  const user = useSelector((state) => state.user.data);

  const [options, setOptions] = useState("recent_material");
  const [optionsResult, setOptionResult] = useState([]);

  const navigate = useNavigate();
  const [fetchPostWithOptionsFunction] = useFetchPostWithOptionsMutation();

  useEffect(() => {
    fetchPostWithOptionsFunction({
      options,
      headers: { authorization: "Bearer " + localStorage.getItem("token") },
    }).then(({ data, error }) => {
      if (error) {
      } else {
        setOptionResult(data);
      }
    });
  }, [options, fetchPostWithOptionsFunction]);

  return (
    <div className="user-profile-outer">
      <div className="user-profile-upper">
        <div className="user-profile-img">
          <img
            alt={user.name}
            style={{ height: "10%", width: "10%" }}
            src={user.photo}
            id="user-profile-picture"
          />
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
