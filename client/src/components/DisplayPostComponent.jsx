import {
  AttachFileRounded,
  CloseRounded,
  ImageRounded,
  PictureAsPdfRounded,
  SendRounded,
} from "@mui/icons-material";
import {
    Backdrop,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import JoditEditor from "jodit-react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  useFetchTagsMutation,
  useCreateDoubtMutation,
} from "../services/appApi";
import { BootstrapTooltip } from "./Navbar";

const DisplayPostComponent = ({ existingDoubt }) => {
  const userToken = useSelector((state) => state?.user?.token);

  const descriptionConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Enter your description here...",
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
  const descriptionEditor = useRef(!existingDoubt ? null : existingDoubt?.description);
  const [doubtTitle, setDoubtTitle] = useState(!existingDoubt ? "" : existingDoubt?.doubtTitle);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [newDescription, setNewDescription] = useState(!existingDoubt ? "" : existingDoubt?.description);

  const [tags, setTags] = useState([]);
  const [postTags, setPostTags] = useState(!existingDoubt ? [] : existingDoubt?.tags);

  const [previewFile, setPreviewFile] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const [disableSubmit, setDisableSubmit] = useState(false);
  const [status, setStaus] = useState("Post");

  const [fetchTagsFunction] = useFetchTagsMutation();
  const [createDoubtFunction] = useCreateDoubtMutation();

  useEffect(() => {
    fetchTagsFunction().then(({ data, error }) => {
      if (data) setTags(data);
      else {
        enqueueSnackbar(
          "Unable to fetch tags at the moment! Please try again!",
          { variant: "error", autoHideDuration: 3000 }
        );
      }
    });
  }, [fetchTagsFunction]);

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
    let fileURLS = [];

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

    if(existingDoubt){
        fileURLS = [...existingDoubt?.media, ...fileURLS];
    }

    setStaus("Posting...");
    await createDoubtFunction({
      doubtTitle: doubtTitle,
      tags: postTags,
      media: fileURLS,
      description: newDescription,
      headers: { authorization: "Bearer " + userToken },
      update: !!existingDoubt,
      id: !existingDoubt ? -1 : existingDoubt?._id,
    }).then(({ data, error }) => {
      if (data) {
        enqueueSnackbar(`Doubt ${!existingDoubt ? "posted" : "updated"} successfully!`, {
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
    <>
      <SnackbarProvider maxSnack={3} />
      <Dialog
        disableEnforceFocus
        fullScreen
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
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
                    window.location.href = "/discuss";
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
                      <SendRounded />
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
                        postTags?.indexOf(tag) !== -1 ? "active" : ""
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
                <AttachFileRounded />
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
                        <BootstrapTooltip title="Remove file" placement="right">
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
    </>
  );
};

export default DisplayPostComponent;
