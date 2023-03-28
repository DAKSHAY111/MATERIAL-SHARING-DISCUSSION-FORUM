import { Avatar, Button, Chip, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import {
  useFetchSingleDoubtMutation,
  useAddVoteToDoubtMutation,
  useAddReplyToDoubtMutation,
  useAddVoteToReplyMutation,
  useSortRepliesMutation,
  useDeleteDoubtMutation,
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
import { DeleteRounded, EditRounded, ReplyRounded } from "@mui/icons-material";
import DisplayPostComponent from "../components/DisplayPostComponent";

const DisplayDoubt = () => {
  const user = useSelector((state) => state?.user?.data);
  const userToken = useSelector((state) => state?.user?.token);

  const [disableDelete, setDisableDelete] = useState(false);
  const [edit, setEdit] = useState(false);

  const [requestedDoubt, setRequestedDoubt] = useState(null);
  const [reply, setReply] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [fetchSingleDoubtFunction] = useFetchSingleDoubtMutation();
  const [addVoteToDoubtFunction] = useAddVoteToDoubtMutation();
  const [addReplyToDoubtFunction] = useAddReplyToDoubtMutation();
  const [addVoteToReplyFunction] = useAddVoteToReplyMutation();
  const [sortRepliesFunction] = useSortRepliesMutation();
  const [deleteDoubtFunction] = useDeleteDoubtMutation();

  const commentConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter your comment here...",
      buttons: [
        "bold",
        "italic",
        "ul",
        "ol",
        "link",
        "underline",
        "font",
        "align",
        "fontsize",
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
      {edit && <DisplayPostComponent existingDoubt={requestedDoubt?.doubtData} />}
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
                  {
                    user?._id === requestedDoubt?.doubtData?.creator && (
                      <Button onClick={() => setEdit(true)} className="custom_btn black_dull" startIcon={<EditRounded />}>
                        Edit
                      </Button>
                    )
                  }
                  {user?._id === requestedDoubt?.doubtData?.creator && (
                    <BootstrapTooltip title="Delete Post" placement="left">
                      <Button
                        disabled={disableDelete}
                        onClick={async () => {
                          setDisableDelete(true);
                          await deleteDoubtFunction({
                            doubt: requestedDoubt?.doubtData,
                            headers: {
                              authorization: "Bearer " + userToken,
                            },
                          }).then(({ data, error }) => {
                            if(data){
                              enqueueSnackbar("Doubt deleted successfully!", {
                                variant: "info",
                                autoHideDuration: 3000,
                              });
                              setTimeout(() => window.location.href = "/discuss", 3000);
                            }
                            else{
                              enqueueSnackbar(error.data, {
                                variant: "error",
                                autoHideDuration: 3000,
                              });
                              setDisableDelete(false);
                            }
                          });
                        }}
                        className="custom_btn black_dull"
                        startIcon={<DeleteRounded />}
                      >
                        Delete
                      </Button>
                    </BootstrapTooltip>
                  )}
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
                      requestedDoubt?.doubtData?.upVotes?.indexOf(user?._id) ===
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
                        user?._id
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
                  >{`Comments: ${
                    !requestedDoubt?.replies?.length
                      ? 0
                      : requestedDoubt?.replies?.length
                  }`}</Button>
                </div>
                <div className="right_hand_side">
                  <div className="btn_group">
                    <Button
                      disabled={!reply.length}
                      size="small"
                      startIcon={<ReplyRounded />}
                      className="custom_btn black_dull doubt_action_btn"
                      onClick={async () => {
                        await addReplyToDoubtFunction({
                          reply,
                          doubt: requestedDoubt?.doubtData,
                          headers: {
                            authorization: "Bearer " + userToken,
                          },
                        }).then(async ({ data, error }) => {
                          if (data) {
                            setRequestedDoubt(data);
                            enqueueSnackbar("Reply posted successfully!", {
                              autoHideDuration: 4000,
                            });
                          } else
                            enqueueSnackbar(error.data, {
                              variant: "error",
                              autoHideDuration: 4000,
                            });
                          setReply("");
                        });
                      }}
                    >
                      Add Reply
                    </Button>
                    <Button
                      onClick={async () => {
                        await sortRepliesFunction({
                          id: searchParams.get("id"),
                          type: "most_votes",
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
                      size="small"
                      startIcon={<WhatshotRounded />}
                      className="custom_btn black_dull doubt_action_btn"
                    >
                      Most Votes
                    </Button>
                    <Button
                      onClick={async () => {
                        await sortRepliesFunction({
                          id: searchParams.get("id"),
                          type: "most_recent",
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
                  <JoditEditor
                    config={commentConfig}
                    value={reply}
                    onChange={(e) => setReply(e)}
                  />
                </div>
              </div>
              <div className="display_replies_outer">
                <div className="display_replies_wrapper">
                  {requestedDoubt?.replies?.map((reply, idx) => (
                    <div key={idx} className="single_reply_outer">
                      <div className="single_reply_wrapper">
                        <div className="owner_info_outer">
                          <div className="owner_info_wrapper">
                            <Avatar src={reply?.ownerInfo?.photo} />
                            <div
                              onClick={() =>
                                navigate(
                                  `/account?user=${reply?.ownerInfo?.name}`
                                )
                              }
                              className="doubt_owner_name"
                            >
                              {reply?.ownerInfo?.name}
                            </div>
                            <BootstrapTooltip
                              title="Reputation"
                              placement="top"
                            >
                              <div className="owner_reputation">
                                <Button
                                  size="small"
                                  className="custom_btn m-0 black_dull doubt_owner_reputation"
                                  style={{
                                    fontFamily: "Segoe UI",
                                    fontWeight: 500,
                                  }}
                                  startIcon={<Star />}
                                >
                                  {reply?.ownerInfo?.reputation}
                                </Button>
                              </div>
                            </BootstrapTooltip>
                            <div className="reply_action_outer">
                              <IconButton
                                onClick={async () => {
                                  await addVoteToReplyFunction({
                                    doubt: requestedDoubt,
                                    reply: reply?.replyData,
                                    type: "up",
                                    headers: {
                                      authorization: "Bearer " + userToken,
                                    },
                                  }).then(async ({ data, error }) => {
                                    if (data) {
                                      setRequestedDoubt(data);
                                    } else
                                      enqueueSnackbar(error.data, {
                                        variant: "error",
                                        autoHideDuration: 4000,
                                      });
                                  });
                                }}
                              >
                                <ArrowDropUpSharp
                                  className={`${
                                    reply?.replyData?.upVotes?.indexOf(
                                      user?._id
                                    ) === -1
                                      ? "black_dull"
                                      : "black"
                                  }`}
                                />
                              </IconButton>
                              <div
                                style={{
                                  fontFamily: "Segoe UI",
                                  fontWeight: 500,
                                }}
                              >
                                {!reply?.replyData?.upVotes?.length
                                  ? 0
                                  : reply?.replyData?.upVotes?.length}
                              </div>
                              <IconButton
                                onClick={async () => {
                                  await addVoteToReplyFunction({
                                    doubt: requestedDoubt,
                                    reply: reply?.replyData,
                                    type: "down",
                                    headers: {
                                      authorization: "Bearer " + userToken,
                                    },
                                  }).then(async ({ data, error }) => {
                                    if (data) {
                                      setRequestedDoubt(data);
                                    } else
                                      enqueueSnackbar(error.data, {
                                        variant: "error",
                                        autoHideDuration: 4000,
                                      });
                                  });
                                }}
                              >
                                <ArrowDropDownIcon
                                  className={`${
                                    reply?.replyData?.downVotes?.indexOf(
                                      user?._id
                                    ) === -1
                                      ? "black_dull"
                                      : "black"
                                  }`}
                                />
                              </IconButton>
                            </div>
                            {Math.floor(
                              Math.abs(
                                Date.now() -
                                  Date.parse(reply?.replyData?.createdAt)
                              ) /
                                (1000 * 60)
                            ) < 60 ? (
                              <div className="doubt_posted_time">
                                {`created ${Math.floor(
                                  Math.abs(
                                    Date.now() -
                                      Date.parse(reply?.replyData?.createdAt)
                                  ) /
                                    (1000 * 60)
                                )} minutes ago`}
                              </div>
                            ) : Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60)
                              ) < 24 ? (
                              <div className="doubt_posted_time">{`created ${Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60)
                              )} Hours ago`}</div>
                            ) : Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60 * 24)
                              ) < 30 ? (
                              <div className="doubt_posted_time">{`created ${Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60 * 24)
                              )} Days ago`}</div>
                            ) : Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60 * 24 * 30)
                              ) < 12 ? (
                              <div className="doubt_posted_time">{`created ${Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60 * 24 * 30)
                              )} Months ago`}</div>
                            ) : (
                              <div className="doubt_posted_time">{`created ${Math.floor(
                                Math.abs(
                                  Date.now() -
                                    Date.parse(reply?.replyData?.createdAt)
                                ) /
                                  (1000 * 60 * 60 * 24 * 30 * 12)
                              )} Years ago`}</div>
                            )}
                          </div>
                        </div>
                        <div className="doubt_description_outer">
                          <div className="doubt_description_wrapper">
                            {parse(reply?.replyData?.reply)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
