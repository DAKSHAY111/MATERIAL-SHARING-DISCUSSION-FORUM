import { Alert, Backdrop, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useFetchTagsMutation,
  useCreatePostMutation,
} from "../services/appApi";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

import { BootstrapTooltip } from "./Navbar";

import "../style/Signup.css";
import "../style/CreatePost.css";

const CreatePost = () => {
  const user = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fetchTagsFunction] = useFetchTagsMutation();
  const [createPostFunc] = useCreatePostMutation();

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
  }, [fetchTagsFunction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableSubmit(true);

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
      let urlData = response.json();
      urlData = urlData?.url;
      createPostFunc({ title, tags, description, media: urlData, user, headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      } }).then(
        ({ data, error }) => {
          console.log(data);
          console.log(error);
          setResponse(true);
          if (error) {
            setAlertMessage(error.data.message);
            setIsError(true);
          } else {
            setTags([]);
            setTitle("");
            setDescription("");
            setFile(null);
            setDisableSubmit(true);
            setAlertMessage("Post created successfully!");
            setIsError(false);
          }
        }
      );
    } catch (ex) {
      setAlertMessage("Error Occurred while posting");
      setIsError(true);
    }
  };

  const handlePostUpload = (e) => {
    e.preventDefault();
    if (e.target.files[0].size > 2097152) {
      setAlertMessage("Maximum size exceeded!! Max Limit - 2MB");
      setIsError(true);
      setResponse(true);
      return;
    }
    setFile(e.target.files[0]);
    setDisableSubmit(false);
  };

  return (
    <div className="create-post-outer">
      <Backdrop
        className="backdrop-dialog"
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openPreview}
        onClick={() => setOpenPreview(false)}
      >
        {file !== null ? (
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
              data={URL.createObjectURL(file)}
              type={file?.type}
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
          setDisableSubmit(false);
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
      <div className="create-post-wrapper">
        <div className="flex-row-2 left-section">
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="custom-input-field"
            type="text"
            variant="outlined"
            label="Title"
            margin="dense"
            id="input-title"
            required
            autoFocus={true}
          />
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="custom-input-field"
            type="text"
            variant="outlined"
            label="Description"
            margin="dense"
            id="input-description"
            multiline
            required
            maxRows={2}
          />
          <div className="file-input-outer">
            {file !== null ? (
              <div className="uploaded-document-details">
                {file.type === "application/pdf" ? (
                  <PictureAsPdfRoundedIcon className="file-assistant-icon" />
                ) : (
                  <ImageRoundedIcon className="file-assistant-icon" />
                )}
                <BootstrapTooltip title="View file" placement="top">
                  <div
                    onClick={() => setOpenPreview(true)}
                    className="file-name"
                  >
                    {file.name}
                  </div>
                </BootstrapTooltip>
                <BootstrapTooltip title="Remove File" placement="top">
                  <CloseRoundedIcon
                    onClick={() => {
                      setFile(null);
                      setDisableSubmit(true);
                    }}
                    className="file-assistant-icon"
                  />
                </BootstrapTooltip>
              </div>
            ) : (
              <div className="uploaded-document-details">
                <BootstrapTooltip
                  title="Please upload a file to continue"
                  placement="top"
                >
                  <ErrorRoundedIcon className="file-assistant-icon" />
                </BootstrapTooltip>
                <div className="file-name">No File Chosen</div>
              </div>
            )}
            <div className="button-group">
              <input
                type="file"
                id="post-file-input"
                hidden
                className="file-input"
                accept="image/jpg, image/png, image/jpeg, application/pdf"
                onChange={handlePostUpload}
              />
              <label className="input-label" htmlFor="post-file-input">
                Select File
              </label>
              <Button
                className="create-post-button"
                disabled={disableSubmit}
                onClick={handleSubmit}
                variant="contained"
                color="info"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
        <div className="tags-outer">
          <div className="tags-heading">
            <div className="tags-title">Select Tags from Below</div>
            <BootstrapTooltip placement="right" title="Clear Tags">
              <CloseRoundedIcon
                style={{
                  visibility: selectedTags.length > 0 ? "visible" : "hidden",
                }}
                onClick={() => setSelectedTags([])}
                className="clear-icon-tags"
              />
            </BootstrapTooltip>
          </div>
          <div className="tags-collection">
            {tags?.map((tag) => (
              <p
                onClick={() => {
                  if (selectedTags.indexOf(tag) === -1)
                    setSelectedTags((state) => [...state, tag]);
                  else
                    setSelectedTags((state) =>
                      state.filter((all) => all !== tag)
                    );
                }}
                key={tag}
                className={`tag-representation ${
                  selectedTags.indexOf(tag) !== -1
                    ? "selected-tag-representation"
                    : ""
                }`}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
