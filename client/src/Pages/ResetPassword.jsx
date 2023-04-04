import { Alert, Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/appApi";

// import google from "../static/google.png";

import "../style/Signup.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const [resetPasswordFunc] = useResetPasswordMutation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setToken(searchParams.get("id"));
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    if (password === "" ||
      confirmPassword === "") {
      setIsError(true);
      setAlertMessage("Field can not be empty!!");
      setResponse(true);
      setDisableSubmit(false);
      return;
    }
    else if (
      password.length < 8 ||
      confirmPassword.length < 8
    ) {
      setIsError(true);
      setAlertMessage("Password is too weak!!");
      setResponse(true);
      setDisableSubmit(false);
      return;
    } else if (password !== confirmPassword) {
      setIsError(true);
      setAlertMessage("Password and Confirm Password do not match!!");
      setResponse(true);
      setDisableSubmit(false);
      return;
    }
    await resetPasswordFunc({ token: token, newPassword: password }).then(
      ({ data, error }) => {
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
          setTimeout(() => window.location.href = "/login", 1500);
        }
      }
    );
  };
  return (
    <div className="signup-outer">
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
      <div className="signup-wrapper">
        <div className="flex-center-wrapper row-gap-2">
          {/* <div className="company-title">
            <img id="company-logo" src={google} alt="GoogleLogo" />
          </div> */}
          <div className="company-title">
            CodeStudy
          </div>
          <div className="reset-info-paragraph">
            We recommend to type in strong password of minimum length 8 with
            lower case, upper case and some special characters to keep your
            account safe.
          </div>
          <div className="signup-form">
            <div className="input-item">
              <TextField
                className="custom-input-field"
                type="password"
                variant="outlined"
                label="Password"
                margin="dense"
                id="input-password"
                required
                autoFocus={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-item">
              <TextField
                className="custom-input-field"
                type="password"
                variant="outlined"
                label="Confirm Password"
                margin="dense"
                id="input-confirm-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="button-group">
              <Button
                onClick={() => {
                  navigate("/login");
                }}
              >
                cancel
              </Button>
              <Button disabled={disableSubmit} onClick={handleResetPassword}>
                {
                  disableSubmit ? (
                    <CircularProgress style={{ width: "20px", height: "20px" }} />
                  ) : (
                    "Reset Password"
                  )
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
