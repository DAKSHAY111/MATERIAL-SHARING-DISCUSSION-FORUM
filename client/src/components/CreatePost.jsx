import { Alert, Backdrop, TextField } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { useFetchTagsMutation } from "../services/appApi";

import google from "../static/google.png";

import "../style/Signup.css";
import "../style/CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fetchTagsFunction] = useFetchTagsMutation();

  useEffect(() => {
    fetchTagsFunction().then(async ({ data, error }) => {
      if (error) {
        setIsError(true);
        setAlertMessage(error.data);
        setResponse(true);
      } else {
        setTags(data);
      }
    });
  }, []);
  return (
    <div className="create-post-outer">
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
        <div className="flex-column-2">
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
            maxRows={2}
          />
        </div>
        <div className="tags-title">Selected Tags</div>
        <div className="tags-collection">
          {selectedTags?.map((tag) => (
            <p
              onClick={() => {
                setTags((state) => [...state, tag]);
                setSelectedTags((state) => state?.filter((all) => all !== tag));
              }}
              key={tag}
              className="selected-tag-representation"
            >
              {tag}
            </p>
          ))}
        </div>
        <div className="tags-title">Select Tags from Below</div>
        <div className="tags-collection">
          {tags?.map((tag) => (
            <p
              onClick={() => {
                setSelectedTags((state) => [...state, tag]);
                setTags((state) => state?.filter((all) => all !== tag));
              }}
              key={tag}
              className="tag-representation"
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
