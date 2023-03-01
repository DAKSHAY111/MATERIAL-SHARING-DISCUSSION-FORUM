import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import {
  useFetchTagsMutation,
  useFetchAllPostsMutation,
} from "../services/appApi";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import CloseRounded from "@mui/icons-material/CloseRounded";
import { Alert, Backdrop, IconButton } from "@mui/material";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import "../style/HomePage.css";
import { BootstrapTooltip } from "../components/Navbar";

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
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [postData, setPostData] = useState([]);
  const [allPostsData, setAllPostsData] = useState([]);

  const [previewFile, setPreviewFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [searchField, setSearchField] = useState("");

  const [fetchTagsFunction] = useFetchTagsMutation();
  const [fetchAllPostsFunction] = useFetchAllPostsMutation();

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

    fetchAllPostsFunction({
      filters: { selectedTags: [] },
    }).then(({ data, error }) => {
      if (data) {
        setAllPostsData(data);
        setPostData(data);
      } else {
        setIsError(true);
        setAlertMessage(error);
        setResponse(true);
      }
    });
  }, [fetchTagsFunction, fetchAllPostsFunction]);

  useEffect(() => {
    setPostData([]);

    if (selectedTags !== [])
      setPostData(() =>
        allPostsData.filter(({ postData }) =>
          selectedTags.every((tag) => postData.tags.includes(tag))
        )
      );

    if (searchField !== "")
      setPostData((state) =>
        state.filter(({ postData }) =>
          postData?.title.toLowerCase().includes(searchField.toLowerCase())
        )
      );
  }, [selectedTags, allPostsData, setPostData, searchField]);

  return (
    <div className="home-page-outer">
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
              type={previewFile.media.substr((previewFile.media.length - 3), 3) === "pdf" ? "application/pdf" : "image/jpg"}
            />
          </>
        ) : (
          ""
        )}
      </Backdrop>
      <Backdrop
        className="backdrop-dialog"
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={response}
        onClick={() => {
          setResponse(false);
          setAlertMessage("");
        }}
      >
        <Alert
          className="response-dialog"
          style={{
            display: response ? "flex" : "none",
            color: isError ? "red" : "green",
          }}
          severity={isError ? "error" : "success"}
        >
          {alertMessage}
        </Alert>
      </Backdrop>
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
              <div className="tags-title">Filter by tags</div>
              <div className="search-by-tags-wrapper">
                {tags?.map((tag, idx) => (
                  <div
                    className={`tag-representation ${
                      selectedTags.indexOf(tag) !== -1
                        ? "selected-tag-representation"
                        : ""
                    }`}
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
            {postData.length === 0 ? (
              <p className="no-posts-found">No posts found!</p>
            ) : (
              postData?.map(({ postData, ownerInfo }, idx) => (
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
                  {/* {<object height={'500vh'} width={'auto'} aria-labelledby="Document..." data={postData.media} />} */}
                  <CardContent>
                    <Typography
                      variant="body1"
                      className="post-description"
                      component="p"
                    >
                      {postData.description}
                    </Typography>
                    {postData.tags.map((tag) => (
                      <Chip className="home-post-tags" key={tag} label={tag} />
                    ))}
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
