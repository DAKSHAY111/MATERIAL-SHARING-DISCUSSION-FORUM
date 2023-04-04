import { Alert, Button, Chip, CircularProgress, Link, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  useFetchPostWithOptionsMutation,
  useFetchUserDataMutation,
} from "../services/appApi";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import GitHubIcon from "@mui/icons-material/GitHub";

import "../style/DisplayProfile.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import { LinkedIn } from "@mui/icons-material";
import { BootstrapTooltip } from "./Navbar";

const DisplayProfile = () => {
  const user = useSelector((state) => state?.user?.data);
  const userToken = useSelector((state) => state?.user?.token);

  const [queriedUser, setQueriedUser] = useState(null);
  const [githubUsername, setGithubUsername] = useState(queriedUser?.githubLink);
  const [linkedInUsername, setLinkedInUsername] = useState(
    queriedUser?.linkedInLink
  );

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [options, setOptions] = useState("recent_material");
  const [optionsResult, setOptionResult] = useState([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fetchPostWithOptionsFunction] = useFetchPostWithOptionsMutation();
  const [fetchUserDataFunction] = useFetchUserDataMutation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let requestedUser = searchParams.get("user");
    if (!requestedUser && user) requestedUser = user?.name;

    fetchUserDataFunction({
      name: requestedUser,
      headers: { authorization: "Bearer " + userToken },
    }).then(({ data, error }) => {
      if (data) setQueriedUser(data);
      else {
        setIsError(true);
        setAlertMessage("Unable to reach server! Please try again!");
        setResponse(true);
      }
      setLoading(false);
    });
  }, [fetchUserDataFunction, searchParams, userToken, user]);

  useEffect(() => {
    let requestedUser = searchParams.get("user");
    if (!requestedUser && user) requestedUser = user?.name;

    fetchPostWithOptionsFunction({
      options,
      name: requestedUser,
      headers: { authorization: "Bearer " + userToken },
    }).then(({ data, error }) => {
      if (error) {
        setIsError(true);
        setAlertMessage(error?.data);
        setResponse(true);
      } else {
        setOptionResult(data);
      }
    });
  }, [options, fetchPostWithOptionsFunction, searchParams, userToken, user]);

  useEffect(() => {
    const git = queriedUser?.githubLink?.split("/");
    setGithubUsername(git?.slice(-1));

    const linkedin = queriedUser?.linkedInLink?.split("/");
    if (linkedin?.slice(-1)?.[0]?.length === 0) linkedin?.pop();
    setLinkedInUsername(linkedin?.slice(-1));
  }, [queriedUser]);

  return (
    <>
    {loading && <CircularProgress style={{ width: 40, height: 40, position: "absolute", top: "50%", left: "50%", color: "#1772cd" }} />}
      <Snackbar
        onClose={() => setResponse(false)}
        autoHideDuration={2000}
        open={response}
      >
        <Alert
          variant="filled"
          severity={`${isError ? "error" : "success"}`}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      {!loading && !!queriedUser && (
        <div className="user-profile-outer">
          <div className="user-profile-upper">
            <div className="user-profile-top-i">
              <div className="user-profile-top-i-inner">
                <div className="user-profile-img">
                  <img
                    style={{
                      objectFit: "contain",
                      border: "2px solid #0154a8",
                    }}
                    alt={queriedUser?.name}
                    src={queriedUser?.photo}
                    id="user-profile-picture"
                  />
                </div>
                <div className="user-name-div">
                  <div className="user-display-name">
                    {queriedUser?.displayName?.[0]?.toUpperCase() +
                      queriedUser?.displayName?.substr(1)}
                  </div>
                  <div className="user-name">{queriedUser?.name}</div>
                </div>
              </div>
              <div className="users-about">{queriedUser?.about}</div>
              <div className="user_social_links">
                {queriedUser?.githubLink !== "" && (
                  <BootstrapTooltip title="Github" placement="right">
                    <Link
                      target={"_blank"}
                      rel="noopener"
                      underline="none"
                      className="user_social_links_description black_dull"
                      href={`${queriedUser?.githubLink}`}
                    >
                      <GitHubIcon />
                      {githubUsername}
                    </Link>
                  </BootstrapTooltip>
                )}
                {queriedUser?.linkedInLink !== "" && (
                  <BootstrapTooltip title="LinkedIn" placement="right">
                    <Link
                      target={"_blank"}
                      rel="noopener"
                      underline="none"
                      className="user_social_links_description black_dull"
                      href={`${queriedUser?.linkedInLink}`}
                    >
                      <LinkedIn />
                      {linkedInUsername}
                    </Link>
                  </BootstrapTooltip>
                )}
              </div>
              <Button
                style={{
                  display: queriedUser?.name === user?.name ? "flex" : "none",
                }}
                onClick={() => (window.location.href = `/edit/profile`)}
                className="custom_btn active edit-profile-btn"
                variant="text"
                color="info"
              >
                Edit Profile
              </Button>
              <div className="community-stats">
                <div className="title">Technical Skills</div>
                <div className="skill_previewer width_100">
                  {!!queriedUser?.technicalSkills?.length &&
                    queriedUser?.technicalSkills?.map((skill, idx) => (
                      <Chip
                        key={idx}
                        className="home-post-tags active"
                        label={skill}
                      />
                    ))}
                </div>
              </div>
              <div className="community-stats">
                <div className="title">Community Stats</div>
                <div className="stats-info">
                  <Chip
                    className="stats-chip"
                    label={`${queriedUser?.materialCount} Material Uploaded`}
                  />
                  <Chip
                    className="stats-chip"
                    label={`${queriedUser?.doubtsCount} Doubts Posted`}
                  />
                  <Chip
                    className="stats-chip"
                    label={`${queriedUser?.repliesCount} Replied to Doubts`}
                  />
                  <Chip
                    className="stats-chip"
                    label={`${
                      (queriedUser?.reputation > 0 ? "+" : "") +
                      queriedUser?.reputation
                    } Reputation Earned`}
                  />
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
              {options === "recent_material" ? (
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
              ) : options === "recent_doubts" ? (
                <div className="lower_insider">
                  {!!optionsResult && optionsResult?.map((element, idx) => (
                    <div
                      className="options_outer"
                      onClick={() =>
                        navigate(
                          `/doubt?id=${element?._id}&src=${window.location.pathname}`
                        )
                      }
                      key={idx}
                    >
                      <div className="post_title">{element?.doubtTitle}</div>

                      <div className="doubt_statistics">
                        <Button
                          disabled
                          startIcon={<VisibilityRounded />}
                          className="doubt_views black"
                        >{`${!element?.views ? 0 : element?.views} views`}</Button>
                        {Math.floor(
                          Math.abs(Date.now() - Date.parse(element.createdAt)) /
                            (1000 * 60)
                        ) < 60 ? (
                          <div className="posted_time">{`${Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60)
                          )} minutes ago`}</div>
                        ) : Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60)
                          ) < 24 ? (
                          <div className="posted_time">{`${Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60)
                          )} Hours ago`}</div>
                        ) : Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60 * 24)
                          ) < 30 ? (
                          <div className="posted_time">{`${Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60 * 24)
                          )} Days ago`}</div>
                        ) : Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60 * 24 * 30)
                          ) < 12 ? (
                          <div className="posted_time">{`${Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60 * 24 * 30)
                          )} Months ago`}</div>
                        ) : (
                          <div className="posted_time">{`${Math.floor(
                            Math.abs(
                              Date.now() - Date.parse(element.createdAt)
                            ) /
                              (1000 * 60 * 60 * 24 * 30 * 12)
                          )} Years ago`}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayProfile;
