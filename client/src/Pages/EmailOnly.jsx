import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestNewPasswordMutation } from "../services/appApi";

// import google from "../static/google.png";

const EmailOnly = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const navigate = useNavigate();
  const [newPasswordRequestFunc] = useRequestNewPasswordMutation();

  const handleResetPassword = (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    if (inputEmail === "") {
      setIsError(true);
      setAlertMessage("Field can not be empty!");
      setResponse(true);
      setDisableSubmit(false);
      return;
    }
    newPasswordRequestFunc({ email: inputEmail }).then(
      async ({ data, error }) => {
        if (error) {
          setIsError(true);
          setAlertMessage(error.data);
          setResponse(true);
          setDisableSubmit(false);
        } else {
          setIsError(false);
          setAlertMessage(data);
          setResponse(true);
          setDisableSubmit(false);
        }
      }
    );
  };

  return (
    <div className="email-outer">
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
      <div className="flex-center-wrapper row-gap-2">
        {/* <div className="company-title">
          <img id="company-logo" src={google} alt="GoogleLogo" />
        </div> */}
        <div className="company-title">CodeStudy</div>
        <div className="info-paragraph">
          An verification mail will be sent to the email provided by you. Please
          reset your password within 2 hours of time limit otherwise link will
          be expired.
        </div>
        <div onSubmit={handleResetPassword} className="input-item">
          <TextField
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            type="email"
            variant="outlined"
            label="Email"
            margin="dense"
            id="input-reset-email"
            required
            autoFocus={true}
            autoComplete="off"
          />
          <div className="button-group">
            <Button
              onClick={() => {
                navigate("/login");
              }}
            >
              Back to login
            </Button>
            <Button disabled={disableSubmit} onClick={handleResetPassword}>
              {disableSubmit ? (
                <CircularProgress style={{ width: "20px", height: "20px" }} />
              ) : (
                "Send Email"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOnly;
