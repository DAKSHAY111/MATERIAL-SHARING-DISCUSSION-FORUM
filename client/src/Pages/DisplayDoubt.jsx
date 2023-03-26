import { Avatar, Button, Chip } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import {
  useFetchSingleDoubtMutation,
  useAddVoteToDoubtMutation,
} from "../services/appApi";

import { enqueueSnackbar, SnackbarProvider } from "notistack";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpSharp from "@mui/icons-material/ArrowDropUpSharp";
import ChatIcon from "@mui/icons-material/Chat";
import Star from "@mui/icons-material/Star";
import WhatshotRounded from "@mui/icons-material/WhatshotRounded";

import "../style/DisplayDoubt.css";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BootstrapTooltip } from "../components/Navbar";

import parse from "html-react-parser";
import JoditEditor from "jodit-react";

const DisplayDoubt = () => {
  const user = useSelector((state) => state?.user?.data);
  const userToken = useSelector((state) => state?.user?.token);

  const [requestedDoubt, setRequestedDoubt] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [fetchSingleDoubtFunction] = useFetchSingleDoubtMutation();
  const [addVoteToDoubtFunction] = useAddVoteToDoubtMutation();

  const commentConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter your comment here...",
      buttons: [
        "bold",
        "italic",
        "ul",
        "ol",
        "underline",
        "font",
        "link",
        "unlink",
        "align",
        "image",
        "fontsize",
        "brush",
        "redo",
        "undo",
      ],
    }),
    []
  );

  useEffect(() => {
    const id = searchParams.get("id");
    fetchSingleDoubtFunction({ id }).then(async ({ data, error }) => {
      if (data) setRequestedDoubt(data);
      else {
        enqueueSnackbar(error.data, {
          variant: "error",
          autoHideDuration: 4000,
        });
      }
    });
  }, [fetchSingleDoubtFunction, searchParams]);

  return (
    <div className="display_doubt_outer">
      <SnackbarProvider maxSnack={3}></SnackbarProvider>
      {!!requestedDoubt && (
        <div className="display_doubt_wrapper">
          <div className="section_i_outer">
            <div className="section_i_wrapper">
              <div className="left_hand_side">
                <Button
                  onClick={() => navigate(`/discuss`)}
                  size="small"
                  startIcon={<ArrowBackIosNewRoundedIcon />}
                  className="custom_btn active black_dull"
                >
                  Back
                </Button>
                <div className="display_doubt_title">
                  {requestedDoubt?.doubtData?.doubtTitle}
                </div>
              </div>
              <div className="right_hand_side">
                <div className="btn_group">
                  <Button
                    disabled
                    className="custom_btn active black"
                    startIcon={<VisibilityRoundedIcon />}
                  >{`${requestedDoubt?.doubtData?.views} Views`}</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="section_ii_outer">
            <div className="section_ii_wrapper">
              <div className="votes_outer">
                <div className="votes_wrappper">
                  <Button
                    onClick={async () => {
                      await addVoteToDoubtFunction({
                        doubtData: requestedDoubt?.doubtData,
                        type: "up",
                        headers: {
                          authorization: "Bearer " + userToken,
                        },
                      }).then(async ({ data, error }) => {
                        if (data) {
                          setRequestedDoubt(data);
                        } else {
                          enqueueSnackbar(error.data, {
                            variant: "error",
                            autoHideDuration: 4000,
                          });
                        }
                      });
                    }}
                    className={`custom_btn active ${
                      requestedDoubt?.doubtData?.upVotes?.indexOf(user._id) ===
                      -1
                        ? "black_dull"
                        : "black"
                    }`}
                  >
                    <ArrowDropUpSharp style={{ scale: "1.5" }} />
                  </Button>
                  <div className="vote_count">
                    {requestedDoubt?.doubtData?.upVotes?.length}
                  </div>
                  <Button
                    onClick={async () => {
                      await addVoteToDoubtFunction({
                        doubtData: requestedDoubt?.doubtData,
                        type: "down",
                        headers: {
                          authorization: "Bearer " + userToken,
                        },
                      }).then(async ({ data, error }) => {
                        if (data) {
                          setRequestedDoubt(data);
                        } else {
                          enqueueSnackbar(error.data, {
                            variant: "error",
                            autoHideDuration: 4000,
                          });
                        }
                      });
                    }}
                    className={`custom_btn active ${
                      requestedDoubt?.doubtData?.downVotes?.indexOf(
                        user._id
                      ) === -1
                        ? "black_dull"
                        : "black"
                    }`}
                  >
                    <ArrowDropDownIcon style={{ scale: "1.5" }} />
                  </Button>
                </div>
              </div>

              <div className="doubt_main_outer">
                <div className="doubt_main_wrapper">
                  <div className="owner_info_outer">
                    <div className="owner_info_wrapper">
                      <Avatar src={requestedDoubt?.ownerInfo?.photo} />
                      <div
                        onClick={() =>
                          navigate(
                            `/account?user=${requestedDoubt?.ownerInfo?.name}`
                          )
                        }
                        className="doubt_owner_name"
                      >
                        {requestedDoubt?.ownerInfo?.name}
                      </div>
                      <BootstrapTooltip title="Reputation" placement="top">
                        <div className="owner_reputation">
                          <Button
                            size="small"
                            className="custom_btn m-0 black_dull doubt_owner_reputation"
                            style={{ fontFamily: "Segoe UI", fontWeight: 500 }}
                            startIcon={<Star />}
                          >
                            {requestedDoubt?.ownerInfo?.reputation}
                          </Button>
                        </div>
                      </BootstrapTooltip>
                      {Math.floor(
                        Math.abs(
                          Date.now() -
                            Date.parse(requestedDoubt?.doubtData?.createdAt)
                        ) /
                          (1000 * 60)
                      ) < 60 ? (
                        <div className="doubt_posted_time">{`created ${Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60)
                        )} minutes ago`}</div>
                      ) : Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60)
                        ) < 24 ? (
                        <div className="doubt_posted_time">{`created ${Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60)
                        )} Hours ago`}</div>
                      ) : Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60 * 24)
                        ) < 30 ? (
                        <div className="doubt_posted_time">{`created ${Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60 * 24)
                        )} Days ago`}</div>
                      ) : Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60 * 24 * 30)
                        ) < 12 ? (
                        <div className="doubt_posted_time">{`created ${Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60 * 24 * 30)
                        )} Months ago`}</div>
                      ) : (
                        <div className="doubt_posted_time">{`created ${Math.floor(
                          Math.abs(
                            Date.now() -
                              Date.parse(requestedDoubt?.doubtData?.createdAt)
                          ) /
                            (1000 * 60 * 60 * 24 * 30 * 12)
                        )} Years ago`}</div>
                      )}
                    </div>
                  </div>

                  <div className="doubt_description_outer">
                    <div className="doubt_description_wrapper">
                      {parse(requestedDoubt?.doubtData?.description)}
                    </div>
                  </div>

                  <div className="doubt_tags_outer">
                    <div className="doubt_tags_wrapper">
                      {requestedDoubt?.doubtData?.tags?.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          className={`home-post-tags active`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section_iii_outer">
            <div className="section_iii_wrapper">
              <div className="section_iii_navigation">
                <div className="left_hand_side">
                  <Button
										disabled
                    startIcon={<ChatIcon />}
                    className="custom_btn black doubt_action_btn"
                  >{`Comments: ${requestedDoubt?.doubtData?.replies?.length}`}</Button>
                </div>
                <div className="right_hand_side">
                  <div className="btn_group">
                    <Button
                      size="small"
                      startIcon={<WhatshotRounded />}
                      className="custom_btn black_dull doubt_action_btn"
                    >
                      Most Votes
                    </Button>
                    <Button
                      size="small"
                      className="custom_btn black_dull doubt_action_btn"
                    >
                      Most Recent
                    </Button>
                  </div>
                </div>
              </div>
              <div className="comment_editor_outer">
                <div className="comment_editor_wrapper">
                  <JoditEditor config={commentConfig} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayDoubt;
