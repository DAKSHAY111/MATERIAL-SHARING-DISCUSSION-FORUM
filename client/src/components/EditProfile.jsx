import React, { useState } from "react";

import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useUpdateUserProfileMutation } from "../services/appApi";

import { useSelector } from "react-redux";

import "../style/EditProfile.css";
import { BootstrapTooltip } from "./Navbar";
import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { enqueueSnackbar, SnackbarProvider } from "notistack";

const EditProfile = () => {
  const user = useSelector((state) => state?.user?.data);
  const userToken = useSelector((state) => state?.user?.token);

  const [userImg, setUserImg] = useState(null);
  const [userGender, setUserGender] = useState(user?.gender);
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState(user?.technicalSkills);
  const [tempSkill, setTempSkill] = useState("");
  const [about, setAbout] = useState(user?.about);
  const [githubLink, setGithubLink] = useState(user?.githubLink || "");
  const [linkedInLink, setLinkedInLink] = useState(user?.linkedInLink || "");

  const [status, setStatus] = useState("Update");
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [updateProfileFunction] = useUpdateUserProfileMutation();

  const handleUpdate = async () => {
    if (displayName === "") {
      enqueueSnackbar("Display Name can not be empty!", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }
    if (password.length > 0 && password.length < 8) {
      enqueueSnackbar("Password has to be atleast 8 characters long!", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }
    if (githubLink.length && !githubLink.includes("https://github.com")) {
      enqueueSnackbar("Invalid Github link!", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }
    if (
      linkedInLink.length &&
      !(
        linkedInLink.includes("https://linkedin.com/") ||
        linkedInLink?.includes("https://www.linkedin.com/")
      )
    ) {
      enqueueSnackbar("Invalid LinkedIn link!", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    setDisableSubmit(true);
    setStatus("Uploading Image");

    let urlData = userImg || user?.photo;
    if (userImg)
      try {
        const formData = new FormData();
        formData.append("file", userImg);
        formData.append("upload_preset", "post_uploader_preset");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dhdhpzhtq/image/upload",
          {
            method: "post",
            body: formData,
          }
        );
        urlData = await response.json();
        urlData = urlData?.url;
      } catch (err) {
        enqueueSnackbar(
          "Error occurred while uploading image! Please try again!",
          {
            variant: "error",
            autoHideDuration: 3000,
          }
        );
        return;
      }

    setStatus("Updating Profile");

    await updateProfileFunction({
      displayName: displayName,
      password: password,
      gender: userGender,
      about: about,
      githubLink: githubLink,
      linkedInLink: linkedInLink,
      technicalSkills: skills,
      photo: urlData,
      headers: {
        authorization: "Bearer " + userToken
      }
    }).then(async ({ data, error }) => {
      if (data)
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      else
        enqueueSnackbar(error.data.message, {
          variant: "error",
          autoHideDuration: 3000,
        });

      setDisableSubmit(false);
      setStatus("Update");
    });
  };

  return (
    <div className="edit_profile_outer">
      <SnackbarProvider maxSnack={3}></SnackbarProvider>
      <div className="edit_profile_wrapper">
        <div className="edit_profile_left_sider">
          <div className="user_profile_img">
            <img
              alt={user?.name}
              style={{ objectFit: "contain", border: "2px solid #0154a8" }}
              src={!!userImg ? URL.createObjectURL(userImg) : user?.photo}
              id="user_profile_picture"
            />
            <label className="add_photo_icon" htmlFor="user_new_img">
              <BootstrapTooltip title="Upload Image" placement="bottom">
                <AddCircleRoundedIcon className="add_photo_icon" />
              </BootstrapTooltip>
            </label>
            <input
              onChange={(e) => setUserImg(e.target.files[0])}
              type="file"
              hidden
              id="user_new_img"
            />
          </div>
          <div className="community-stats">
            <div className="title">Technical Skills</div>
          </div>
          <div className="skill_previewer">
            {!!skills.length &&
              skills?.map((skill) => (
                <BootstrapTooltip title="Click to remove" placement="right">
                  <Chip
                    onClick={() =>
                      setSkills((state) =>
                        state?.filter((tag) => tag !== skill)
                      )
                    }
                    className="home-post-tags active"
                    label={skill}
                  />
                </BootstrapTooltip>
              ))}
          </div>
          <div className="input-item">
            <TextField
              id="skills_input"
              size="small"
              className="custom-input-field"
              type="text"
              variant="outlined"
              label="Technical Skills"
              margin="dense"
              value={tempSkill}
              placeholder={"Press Enter to split"}
              autoComplete="off"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  if (tempSkill.length)
                    setSkills((state) => [...state, tempSkill]);
                  setTempSkill("");
                } else if (
                  e.key !== "Alt" &&
                  e.key !== "Backspace" &&
                  e.key !== "Shift" &&
                  e.key !== "Tab" &&
                  e.key !== "Control" &&
                  e.key !== "PageUp" &&
                  e.key !== "PageDown" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "ArrowUp" &&
                  e.key !== "ArrowDown"
                )
                  setTempSkill((state) => state + e.key);
                else if (e.key === "Backspace")
                  setTempSkill((state) => state.substring(0, state.length - 1));
              }}
            />
          </div>
        </div>
        <div className="editable_fields_outer">
          <div className="editable_fields_wrapper">
            <div className="input-item">
              <TextField
                size="small"
                className="custom-input-field"
                type="text"
                variant="outlined"
                label="Username"
                margin="dense"
                autoFocus
                value={user?.name}
                onChange={() => null}
              />
            </div>
            <div className="input-item">
              <TextField
                size="small"
                className="custom-input-field"
                type="text"
                variant="outlined"
                label="Display Name"
                margin="dense"
                value={displayName}
                required
                autoComplete="off"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="input-item">
              <TextField
                size="small"
                className="custom-input-field"
                type="email"
                variant="outlined"
                label="Email"
                margin="dense"
                value={user?.email}
              />
            </div>
            <div className="input-item">
              <BootstrapTooltip
                title="Keep this field empty if you don't wanna update it!"
                placement="bottom"
              >
                <TextField
                  size="small"
                  className="custom-input-field"
                  type={`${showPassword ? "text" : "password"}`}
                  variant="outlined"
                  label="Password"
                  margin="dense"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((state) => !state)}
                        >
                          {showPassword ? (
                            <VisibilityRoundedIcon />
                          ) : (
                            <VisibilityOffRoundedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </BootstrapTooltip>
            </div>
            <div className="input-item">
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                style={{ marginLeft: 0, marginRight: 0 }}
                size="small"
                className="custom-input-field"
              >
                <InputLabel id="user_gender">Gender</InputLabel>
                <Select
                  labelId="user_gender"
                  label="Gender"
                  id="user_gender"
                  value={userGender}
                  onChange={(e) => setUserGender(e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="input-item">
              <TextField
                id="about_input"
                size="small"
                className="custom-input-field"
                type="text"
                variant="outlined"
                label="About yourself"
                margin="dense"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <div className="input-item">
              <TextField
                id="github_link_input"
                size="small"
                className="custom-input-field"
                type="text"
                variant="outlined"
                label="Github Link"
                margin="dense"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>
            <div className="input-item">
              <TextField
                id="linkedin_link_input"
                size="small"
                className="custom-input-field"
                type="text"
                variant="outlined"
                label="LinkedIn Link"
                margin="dense"
                value={linkedInLink}
                onChange={(e) => setLinkedInLink(e.target.value)}
              />
            </div>
            <Button
              disabled={disableSubmit}
              onClick={() =>
                (window.location.href = `/account?user=${user?.name}`)
              }
              color="info"
              className="custom-input-field update_profile_action_btn"
            >
              Cancel
            </Button>
            <Button
              disabled={disableSubmit}
              onClick={handleUpdate}
              variant="text"
              disableElevation
              className="custom-input-field update_profile_action_btn update_success"
              endIcon={
                disableSubmit && (
                  <CircularProgress style={{ width: 20, height: 20 }} />
                )
              }
            >
              {status}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
