import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  useFetchAllDoubtsMutation,
  useFetchTagsMutation,
  useCreateDoubtMutation,
} from "../services/appApi";

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import "../style/Discuss.css";

import CloseRounded from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";

import { enqueueSnackbar, SnackbarProvider } from "notistack";

import JoditEditor from "jodit-react";
import PictureAsPdfRounded from "@mui/icons-material/PictureAsPdfRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import { BootstrapTooltip } from "../components/Navbar";
import { useSelector } from "react-redux";
// import parse from "html-react-parser";

const descriptionConfig = {
  readonly: false,
  placeholder: "Enter your description here...",
  buttons: [
    "bold",
    "italic",
    "ul",
    "ol",
    "underline",
    "font",
    "fontsize",
    "brush",
    "redo",
    "undo",
  ],
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  background: "transparent",
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

const Discuss = () => {
  const userToken = useSelector((state) => state?.user?.token);

  const [doubts, setDoubts] = useState([]);
  const [allDoubts, setAllDoubts] = useState([]);
  const [searchField, setSearchField] = useState("");

  const [criteria, setCriteria] = useState("newest_to_oldest");
  const [openPostDialog, setOpenPostDialog] = useState(false);

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [postTags, setPostTags] = useState([]);

  const [doubtTitle, setDoubtTitle] = useState("");
  const descriptionEditor = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [newDescription, setNewDescription] = useState("");

  const [previewFile, setPreviewFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [status, setStaus] = useState("Post");

  const [fetchAllDoubtsFunction] = useFetchAllDoubtsMutation();
  const [fetchTagsFunction] = useFetchTagsMutation();
  const [createDoubtFunction] = useCreateDoubtMutation();

  useEffect(() => {
    fetchAllDoubtsFunction().then(({ data, error }) => {
      if (data) {
        setDoubts(data);
        setAllDoubts(data);
      } else {
        enqueueSnackbar(
          "Unable to fetch doubts at the moment! Please try again!",
          { variant: "error", autoHideDuration: 3000 }
        );
      }
    });

    fetchTagsFunction().then(({ data, error }) => {
      if (data) setTags(data);
      else {
        enqueueSnackbar(
          "Unable to fetch tags at the moment! Please try again!",
          { variant: "error", autoHideDuration: 3000 }
        );
      }
    });
  }, [fetchAllDoubtsFunction, fetchTagsFunction]);

  useEffect(() => {
    setDoubts(
      allDoubts?.filter(({ doubtDetails }) =>
        selectedTags?.every((tag) => doubtDetails?.tags?.includes(tag))
      )
    );

    setDoubts((state) => state.filter((doubt) => doubt?.doubtDetails?.doubtTitle?.includes(searchField)));
  }, [selectedTags, allDoubts, searchField]);

  const handleSubmit = async () => {
    if (doubtTitle === "" || newDescription === "") {
      enqueueSnackbar("Title can not be empty!", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setDisableSubmit(true);
    setStaus("Uploading files...");
    const fileURLS = [];

    for (const file of attachedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "post_uploader_preset");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dhdhpzhtq/image/upload",
          {
            method: "post",
            body: formData,
          }
        );
        let urlData = await response.json();
        urlData = urlData?.url;

        fileURLS.push({
          url: urlData,
          type: file?.type,
        });
      } catch (ex) {
        enqueueSnackbar("Error Occurred while uploading files!", {
          variant: "error",
          autoHideDuration: 3000,
        });
        setDisableSubmit(false);
      }
    }

    setStaus("Posting...");
    await createDoubtFunction({
      doubtTitle: doubtTitle,
      tags: postTags,
      media: fileURLS,
      description: newDescription,
      headers: { authorization: "Bearer " + userToken },
    }).then(({ data, error }) => {
      if (data) {
        enqueueSnackbar("Doubt posted successfully!", {
          autoHideDuration: 3000,
        });
        window.location.href = "/discuss";
      } else {
        enqueueSnackbar(error.data.message, {
          variant: "error",
          autoHideDuration: 3000,
        });
        setStaus("Post");
        setDisableSubmit(false);
      }
    });
  };

  return (
    <div className="discuss-outer">
      <div className="discuss-wrapper">
        <Backdrop
          className="backdrop-dialog"
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
          open={openPreview}
          onClick={() => setOpenPreview(false)}
        >
          {previewFile !== null ? (
            <>
              <BootstrapTooltip title="Close Preview" position="bottom">
                <CloseRounded
                  onClick={() => setOpenPreview(false)}
                  className="close-preview-icon"
                />
              </BootstrapTooltip>
              <object
                aria-labelledby="Previewing Document..."
                onClick={() => setOpenPreview(false)}
                width={"100%"}
                height="100%"
                data={URL.createObjectURL(previewFile)}
                type={previewFile?.type}
              />
            </>
          ) : (
            ""
          )}
        </Backdrop>
        <SnackbarProvider maxSnack={3}></SnackbarProvider>
        <Dialog
          fullScreen
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openPostDialog}
        >
          <div className="post-create-dialog-outer">
            <div className="post-create-dialog-wrapper">
              <div className="post-input-item flex-row">
                <TextField
                  className="custom-post-input-field width_60"
                  type="text"
                  variant="outlined"
                  label="Topic Title"
                  margin="dense"
                  id="input-title"
                  required
                  autoFocus={true}
                  placeholder="Enter topic title..."
                  autoComplete={"off"}
                  value={doubtTitle}
                  onChange={(e) => setDoubtTitle(e.target.value)}
                />
                <div className="btn-group">
                  <Button
                    onClick={() => {
                      setCriteria("newest_to_oldest");
                      setOpenPostDialog(false);
                    }}
                    className="custom_btn"
                  >
                    Close
                  </Button>
                  <Button
                    disabled={disableSubmit}
                    onClick={handleSubmit}
                    endIcon={
                      disableSubmit ? (
                        <CircularProgress style={{ width: 17, height: 17 }} />
                      ) : (
                        <SendRoundedIcon />
                      )
                    }
                    className="custom_btn"
                  >
                    {status}
                  </Button>
                </div>
              </div>
              <div className="post-input-item">
                <div className="post-doubts-tags-outer">
                  <div className="post-doubts-tags-wrapper">
                    {tags?.map((tag) => (
                      <Chip
                        onClick={() => {
                          if (postTags.indexOf(tag) === -1)
                            setPostTags((state) => [...state, tag]);
                          else
                            setPostTags((state) =>
                              state.filter((all) => all !== tag)
                            );
                        }}
                        className={`home-post-tags ${
                          postTags.indexOf(tag) !== -1 ? "active" : ""
                        }`}
                        key={tag}
                        label={tag}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="post-input-item">
                <JoditEditor
                  config={descriptionConfig}
                  ref={descriptionEditor}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e)}
                  className="custom-post-input-field"
                />
              </div>
              <div className="post-input-item">
                <label className="input-label" htmlFor="attach_file_input">
                  <AttachFileRoundedIcon />
                  Attach Files
                </label>
                <input
                  onChange={(e) => {
                    if (
                      e.target.files[0].type !== "image/jpg" &&
                      e.target.files[0].type !== "image/png" &&
                      e.target.files[0].type !== "image/jpeg" &&
                      e.target.files[0].type !== "application/pdf"
                    ) {
                      enqueueSnackbar("File type not supported!", {
                        variant: "error",
                        autoHideDuration: 3000,
                      });
                      return;
                    }
                    setAttachedFiles((state) => [...state, e.target.files[0]]);
                  }}
                  type="file"
                  hidden
                  id="attach_file_input"
                  accept={[
                    "image/jpg",
                    "image/png",
                    "image/jpeg",
                    "application/pdf",
                  ]}
                />
              </div>
              <div className="attached-file-outer">
                <div className="attached-file-wrapper">
                  {attachedFiles?.map((file, idx) => (
                    <div className="attached-file-viewer" key={idx}>
                      <div className="attached-file-type-viewer">
                        {file?.type?.substr(file?.type?.length - 3, 3) ===
                        "pdf" ? (
                          <PictureAsPdfRounded
                            onClick={() => {
                              setPreviewFile(file);
                              setOpenPreview(true);
                            }}
                            className="post-previewing-icon"
                          />
                        ) : (
                          <ImageRounded
                            onClick={() => {
                              setPreviewFile(file);
                              setOpenPreview(true);
                            }}
                            className="post-previewing-icon"
                          />
                        )}
                      </div>
                      <div className="post-action-outer">
                        <div className="attached-file-name-viewer">
                          {file?.name}
                        </div>
                        <div className="remove-action">
                          <BootstrapTooltip
                            title="Remove file"
                            placement="right"
                          >
                            <IconButton
                              onClick={() => {
                                document.getElementById(
                                  "attach_file_input"
                                ).value = null;
                                setAttachedFiles((state) =>
                                  state?.filter((item, idx2) => idx2 !== idx)
                                );
                              }}
                            >
                              <CloseRounded />
                            </IconButton>
                          </BootstrapTooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog>
        <div className="discuss-main-component">
          <div className="discuss-main-component-wrapper">
            <div className="filtering-outer">
              <div className="filtering-wrapper">
                <div className="filter-buttons">
                  <Button
                    onClick={() => {
                      setCriteria("newest_to_oldest");
                    }}
                    className={`custom_filter_btn ${
                      criteria === "newest_to_oldest"
                        ? "custom_filter_btn_active"
                        : ""
                    }`}
                  >
                    Newest to Oldest
                  </Button>
                  <Button
                    onClick={() => {
                      setCriteria("most_votes");
                    }}
                    startIcon={<WhatshotRoundedIcon />}
                    className={`custom_filter_btn ${
                      criteria === "most_votes"
                        ? "custom_filter_btn_active"
                        : ""
                    }`}
                  >
                    Most Votes
                  </Button>
                  <Button
                    onClick={() => {
                      setCriteria("new_post");
                      setOpenPostDialog(true);
                    }}
                    className={`custom_filter_btn ${
                      criteria === "new_post" ? "custom_filter_btn_active" : ""
                    }`}
                    startIcon={<AddRoundedIcon />}
                  >
                    New
                  </Button>
                </div>
                <div className="action-buttons">
                  <div className="search-by-name">
                    <Search className="search-div">
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
                  <div className="add-newpost-outer">
                    <div className="add-newpost-wrapper"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="doubts-outer">
              <div className="doubts-wrapper">
                {doubts?.map(({ doubtDetails, ownerInfo }, idx) => (
                  <div key={idx} className="doubt-preview-outer">
                    <div className="doubt-preview-wrapper">
                      <div className="dynamic-info">
                        <div className="owner-profile">
                          <Avatar
                            style={{ width: 63, height: 63 }}
                            src={ownerInfo?.photo}
                          />
                        </div>
                        <div className="doubt-info">
                          <div className="doubt-title-and-tags-info">
                            <div className="doubt-title">
                              {doubtDetails?.doubtTitle}
                            </div>
                            <div className="doubts-tags">
                              {doubtDetails?.tags?.map(
                                (tag, idx) =>
                                  idx < 4 && (
                                    <Chip
                                      key={idx}
                                      onClick={() => {
                                        if (selectedTags.indexOf(tag) === -1)
                                          setSelectedTags((state) => [
                                            ...state,
                                            tag,
                                          ]);
                                        else
                                          setSelectedTags((state) =>
                                            state.filter((all) => all !== tag)
                                          );
                                      }}
                                      className={`home-post-tags ${
                                        selectedTags.indexOf(tag) !== -1
                                          ? "active"
                                          : ""
                                      }`}
                                      label={tag}
                                    />
                                  )
                              )}
                            </div>
                          </div>
                          <div className="doubt-info">
                            <div className="user-info">
                              {`${ownerInfo?.name} created at ${new Date(
                                doubtDetails?.createdAt
                              ).toLocaleDateString()} | ${new Date(
                                doubtDetails?.createdAt
                              ).getHours()}:${new Date(
                                doubtDetails?.createdAt
                              ).getMinutes()}`}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="static-info">
                        <div className="info-outer">
                          <ArrowDropUpSharpIcon />
                          {doubtDetails?.upVotes}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="doubts-tags-outer">
            <div className="doubts-tags-wrapper">
              {tags?.map((tag) => (
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
                    selectedTags.indexOf(tag) !== -1 ? "active" : ""
                  }`}
                  key={tag}
                  label={tag}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discuss;
