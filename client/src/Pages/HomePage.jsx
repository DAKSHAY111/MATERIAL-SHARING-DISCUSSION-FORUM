import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import {
  useFetchTagsMutation,
  useFetchAllPostsMutation,
} from "../services/appApi";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import CloseRounded from "@mui/icons-material/CloseRounded";
import {
  Alert,
  Backdrop,
  Button,
  CardActions,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

import { BootstrapTooltip } from "../components/Navbar";
import { useSelector } from "react-redux";

import "../style/HomePage.css";

import {
  useAddPostToFavouritesMutation,
  useAddVoteMutation,
} from "../services/appApi";

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

const HomePage = () => {
  const user = useSelector((state) => state?.user?.data);
  const userToken = useSelector((state) => state?.user?.token);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [posts, setPosts] = useState([]);
  const [allPostsData, setAllPostsData] = useState([]);

  const [previewFile, setPreviewFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [searchField, setSearchField] = useState("");
  const [sortCriteria, setSortCriteria] = useState("most_recent");
  const [fullDescriptionPost, setFullDescriptionPost] = useState(null);

  const [loading, setLoading] = useState(false);

  const [fetchTagsFunction] = useFetchTagsMutation();
  const [fetchAllPostsFunction] = useFetchAllPostsMutation();
  const [addPostToFavouriteFunction] = useAddPostToFavouritesMutation();
  const [voteFunction] = useAddVoteMutation();

  useEffect(() => {
    setLoading(true);
    fetchTagsFunction().then(async ({ data, error }) => {
      if (error) {
        setIsError(true);
        setAlertMessage("Unable to connect to the server :(");
        setResponse(true);
      } else {
        setTags(data);
      }
    });

    fetchAllPostsFunction().then(({ data, error }) => {
      if (data) {
        setAllPostsData(data);
        setPosts(data);
      } else {
        setIsError(true);
        setAlertMessage("Unable to connect to the server :(");
        setResponse(true);
      }
      setLoading(false);
    });
  }, [fetchTagsFunction, fetchAllPostsFunction]);

  useEffect(() => {
    setLoading(true);
    setPosts([]);

    if (selectedTags !== [])
      setPosts(() =>
        allPostsData.filter(({ postData }) =>
          selectedTags.every((tag) => postData.tags.includes(tag))
        )
      );

    if (searchField !== "")
      setPosts((state) =>
        state.filter(
          ({ postData, ownerInfo }) =>
            postData?.title.toLowerCase().includes(searchField.toLowerCase()) ||
            ownerInfo?.name.includes(searchField.toLowerCase()) ||
            postData?.description
              .toLowerCase()
              .includes(searchField.toLowerCase()) ||
            postData?.tags?.filter((tag) => tag?.includes(searchField)).length
        )
      );

    switch (sortCriteria) {
      case "most_votes":
        setPosts((state) =>
          state.sort(
            (a, b) =>
              b.postData.upVotes.length -
              b.postData.downVotes.length -
              (a.postData.upVotes.length - a.postData.downVotes.length)
          )
        );
        break;

      default:
        setPosts((state) => state);
        break;
    }
    setLoading(false);
  }, [selectedTags, allPostsData, searchField, sortCriteria]);

  return (
    <div className="home-page-outer">
      {loading && <CircularProgress style={{ width: 40, height: 40, position: "absolute", top: "50%", left: "50%", color: "#1772cd" }} />}
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
            <div className="search-by-votes">
              <FormControl fullWidth>
                <InputLabel id="sort-posts-by-dropdown">Sort By</InputLabel>
                <Select
                  labelId="sort-posts-by-dropdown"
                  fullWidth
                  className="custom_dropdown"
                  label="Sort by"
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
                >
                  <MenuItem value="most_recent">Most Recent</MenuItem>
                  <MenuItem value="most_votes">Most Votes</MenuItem>
                </Select>
              </FormControl>
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
                        id="post-owner-img"
                        onClick={() =>
                          (window.location.href = `/account?user=${ownerInfo?.name}`)
                        }
                        src={ownerInfo.photo}
                        alt={`${ownerInfo.name}'s profile`}
                      />
                    }
                    action={
                      !user ||
                      user?.favourites?.indexOf(postData._id) === -1 ? (
                        <BootstrapTooltip title="Add to Starred">
                          <IconButton
                            onClick={async () => {
                              if (!user) {
                                setIsError(true);
                                setAlertMessage("Please Log in to continue");
                                setResponse(true);
                                return;
                              }
                              await addPostToFavouriteFunction({
                                postData,
                                headers: {
                                  authorization: "Bearer " + userToken,
                                },
                              }).then(({ data, error }) => {
                                if (data) {
                                  setIsError(false);
                                  setAlertMessage("Post added to Starred");
                                } else {
                                  setIsError(true);
                                  setAlertMessage(error.data.message);
                                }
                                setResponse(true);
                              });
                            }}
                          >
                            <StarOutlineIcon />
                          </IconButton>
                        </BootstrapTooltip>
                      ) : (
                        <BootstrapTooltip title="Remove from Starred">
                          <IconButton
                            onClick={() => {
                              if (!user) {
                                setIsError(true);
                                setAlertMessage("Please Log in to continue...");
                                setResponse(true);
                                return;
                              }
                              addPostToFavouriteFunction({
                                postData,
                                headers: {
                                  authorization: "Bearer " + userToken,
                                },
                              }).then(({ data, error }) => {
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
                      )
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
                      {postData.description.substr(
                        0,
                        fullDescriptionPost?._id === postData?._id
                          ? postData.description.length
                          : postData?.description?.length > 40
                          ? 28
                          : 40
                      )}{" "}
                      {postData?._id !== fullDescriptionPost?._id &&
                      postData.description.length > 40 ? (
                        <Button
                          className="view_more_and_less_btn"
                          onClick={() => setFullDescriptionPost(postData)}
                        >
                          view more...
                        </Button>
                      ) : (
                        ""
                      )}
                      {postData?._id === fullDescriptionPost?._id &&
                      postData.description.length > 40 ? (
                        <Button
                          className="view_more_and_less_btn"
                          onClick={() => setFullDescriptionPost(null)}
                        >
                          view less...
                        </Button>
                      ) : (
                        ""
                      )}
                    </Typography>

                    <div className="tag_and_action_outer">
                      <InputLabel className="tags-wrapper">
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
                            className={`home-post-tags ${
                              selectedTags?.includes(tag) ? "active" : ""
                            }`}
                            key={tag}
                            label={tag}
                          />
                        ))}
                      </InputLabel>
                      <CardActions disableSpacing>
                        <div className="action-outer">
                          <IconButton
                            onClick={() => {
                              if (!user) {
                                setIsError(true);
                                setAlertMessage("Please Log in to continue");
                                setResponse(true);
                                return;
                              }
                              voteFunction({
                                postData,
                                type: "up",
                                headers: {
                                  authorization: "Bearer " + userToken,
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
                                  setAllPostsData((state) =>
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
                            {postData?.upVotes?.indexOf(user?._id) === -1 ? (
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
                            if (!user) {
                              setIsError(true);
                              setAlertMessage("Please Log in to continue");
                              setResponse(true);
                              return;
                            }
                            voteFunction({
                              postData,
                              type: "down",
                              headers: {
                                authorization: "Bearer " + userToken,
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
                                setAllPostsData((state) =>
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
                          {postData.downVotes.indexOf(user?._id) === -1 ? (
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

export default HomePage;
