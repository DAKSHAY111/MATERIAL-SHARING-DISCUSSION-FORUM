import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import {
  Alert,
  Backdrop,
  CardActions,
  IconButton,
  Snackbar,
} from "@mui/material";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CloseRounded from "@mui/icons-material/CloseRounded";

import { BootstrapTooltip } from "../components/Navbar";

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import {
  useAddPostToFavouritesMutation,
  useFetchStarredMutation,
  useAddVoteMutation,
  useFetchTagsMutation,
} from "../services/appApi";
import { useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    // backgroundColor: alpha(theme.palette.common.white, 0.25),
    backgroundColor: "whitesmoke",
  },
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  background: "whitesmoke",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const DisplayFavourites = () => {
  const user = useSelector((state) => state.user.data);
  const [posts, setPosts] = useState([]);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchField, setSearchField] = useState("");

  const [addPostToFavouriteFunction] = useAddPostToFavouritesMutation();
  const [fetchFavoritePostsFunction] = useFetchStarredMutation();
  const [voteFunction] = useAddVoteMutation();
  const [fetchTagsFunction] = useFetchTagsMutation();

  const [previewFile, setPreviewFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchTagsFunction().then(async ({ data, error }) => {
      if (error) {
        setIsError(true);
        setAlertMessage(error);
        setResponse(true);
      } else {
        setTags(data);
      }
    });
    fetchFavoritePostsFunction({
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(({ data, error }) => {
      if (data) setPosts(data);
      else {
        setIsError(true);
        setAlertMessage(error);
        setResponse(true);
      }
    });
  }, [fetchFavoritePostsFunction, fetchTagsFunction]);
  return (
    <div className="display-favourites-page-outer">
      <Backdrop
        className="backdrop-dialog"
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openPreview}
        onClick={() => setOpenPreview(false)}
      >
        {previewFile !== null ? (
          <>
            <BootstrapTooltip title="Close Preview" position="bottom">
              <CloseRoundedIcon
                onClick={() => setOpenPreview(false)}
                className="close-preview-icon"
              />
            </BootstrapTooltip>
            <object
              aria-labelledby="Previewing Document..."
              onClick={() => setOpenPreview(false)}
              width={"100%"}
              height="100%"
              data={previewFile.media}
              type={
                previewFile.media.substr(previewFile.media.length - 3, 3) ===
                "pdf"
                  ? "application/pdf"
                  : `image/${previewFile.media.substr(
                      previewFile.media.length - 3,
                      3
                    )}`
              }
            />
          </>
        ) : (
          ""
        )}
      </Backdrop>
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
      <div className="home-page-wrapper">
        <div className="search-outer">
          <div className="search-wrapper">
            <div className="search-by-name">
              <Search className="search-div">
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search by name…"
                  inputProps={{ "aria-label": "search" }}
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                <IconButton onClick={() => setSearchField("")}>
                  <CloseRounded />
                </IconButton>
              </Search>
            </div>
            <div className="search-by-tags-outer">
              <div className="tags-heading">
                <div className="tags-title">Filter by tags</div>
                <BootstrapTooltip placement="right" title="Clear Tags">
                  <CloseRoundedIcon
                    style={{
                      visibility:
                        selectedTags.length > 0 ? "visible" : "hidden",
                    }}
                    onClick={() => setSelectedTags([])}
                    className="clear-icon-tags"
                  />
                </BootstrapTooltip>
              </div>
              <div className="search-by-tags-wrapper">
                {tags?.map((tag, idx) => (
                  <div
                    className={`tag-representation ${
                      selectedTags.indexOf(tag) !== -1
                        ? "selected-tag-representation"
                        : ""
                    } home_tags`}
                    onClick={() => {
                      if (selectedTags.indexOf(tag) === -1)
                        setSelectedTags((state) => [...state, tag]);
                      else
                        setSelectedTags((state) =>
                          state.filter((all) => all !== tag)
                        );
                    }}
                    key={idx}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="post-outer">
          <div className="post-wrapper">
            {posts.length === 0 ? (
              <p className="no-posts-found">No posts found!</p>
            ) : (
              posts?.map(({ postData, ownerInfo }, idx) => (
                <Card className="card-outer" key={idx}>
                  <CardHeader
                    className="post-header"
                    title={postData.title.toUpperCase()}
                    subheader={`by ${ownerInfo.name}`}
                    avatar={
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        src={ownerInfo.photo}
                        alt={`${ownerInfo.name}'s profile`}
                      />
                    }
                    action={
                      <BootstrapTooltip title="Remove from Starred">
                        <IconButton
                          onClick={() => {
                            addPostToFavouriteFunction({
                              postData,
                              headers: {
                                authorization:
                                  "Bearer " + localStorage.getItem("token"),
                              },
                            }).then(({ data, error }) => {
                              console.log(error);
                              if (data) {
                                setIsError(false);
                                setAlertMessage("Post removed from Starred");
                              } else {
                                setIsError(true);
                                setAlertMessage("");
                              }
                              setResponse(true);
                            });
                          }}
                        >
                          <StarIcon />
                        </IconButton>
                      </BootstrapTooltip>
                    }
                  />
                  {postData.media.substr(postData.media.length - 3, 3) ===
                  "pdf" ? (
                    <PictureAsPdfRoundedIcon
                      onClick={() => {
                        setPreviewFile(postData);
                        setOpenPreview(true);
                      }}
                      className="post-previewing-icon"
                    />
                  ) : (
                    <ImageRoundedIcon
                      onClick={() => {
                        setPreviewFile(postData);
                        setOpenPreview(true);
                      }}
                      className="post-previewing-icon"
                    />
                  )}

                  <CardContent>
                    <Typography
                      variant="body1"
                      className="post-description"
                      component="p"
                    >
                      {postData.description}
                    </Typography>

                    <div className="tag_and_action_outer">
                      <div className="tags-wrapper">
                        {postData.tags.map((tag) => (
                          <Chip
                            onClick={() => {
                              if (selectedTags.indexOf(tag) === -1)
                                setSelectedTags((state) => [...state, tag]);
                              else
                                setSelectedTags((state) =>
                                  state.filter((all) => all !== tag)
                                );
                            }}
                            className="home-post-tags"
                            key={tag}
                            label={tag}
                          />
                        ))}
                      </div>
                      <CardActions disableSpacing>
                        <div className="action-outer">
                          <IconButton
                            onClick={() => {
                              voteFunction({
                                postData,
                                type: "up",
                                headers: {
                                  authorization:
                                    "Bearer " + localStorage.getItem("token"),
                                },
                              }).then(({ data, error }) => {
                                if (data) {
                                  setPosts((state) =>
                                    state.map((post) => {
                                      if (
                                        post.postData._id === data.postData._id
                                      )
                                        return data;
                                      else return post;
                                    })
                                  );
                                  setIsError(false);
                                  setAlertMessage(
                                    "Action completed successfully"
                                  );
                                } else {
                                  setIsError(true);
                                  setAlertMessage(error);
                                }
                                setResponse(true);
                              });
                            }}
                          >
                            {postData.upVotes.indexOf(user._id) === -1 ? (
                              <ThumbUpOffAltOutlinedIcon />
                            ) : (
                              <ThumbUpAltIcon />
                            )}
                          </IconButton>
                          <div className="upvote-count">
                            {postData.upVotes.length}
                          </div>
                        </div>

                        <IconButton
                          onClick={() => {
                            voteFunction({
                              postData,
                              type: "down",
                              headers: {
                                authorization:
                                  "Bearer " + localStorage.getItem("token"),
                              },
                            }).then(({ data, error }) => {
                              if (data) {
                                setPosts((state) =>
                                  state.map((post) => {
                                    if (post.postData._id === data.postData._id)
                                      return data;
                                    else return post;
                                  })
                                );
                                setIsError(false);
                                setAlertMessage(
                                  "Action completed successfully"
                                );
                              } else {
                                setIsError(true);
                                setAlertMessage(error);
                              }
                              setResponse(true);
                            });
                          }}
                        >
                          {postData.downVotes.indexOf(user._id) === -1 ? (
                            <ThumbDownAltOutlinedIcon />
                          ) : (
                            <ThumbDownAltIcon />
                          )}
                        </IconButton>
                      </CardActions>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayFavourites;
