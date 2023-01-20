import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import google from "../static/google.png";

const EmailOnly = () => {
  const [inputEmail, setInputEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
  };

  return (
    <div className="email-outer">
      <div className="email-wrapper">
        <div className="company-title">
          <img id="company-logo" src={google} alt="GoogleLogo" />
        </div>
        <div className="info-paragraph">
          An verification mail will be sent to the email provided by you. Please
          reset your password within 2 hours of time limit otherwise link will
          be expired.
        </div>
        <form onSubmit={handleResetPassword} className="input-item">
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
          />
          <div className="button-group">
            <Button
              onClick={() => {
                navigate("/login");
              }}
            >
              Back to login
            </Button>
            <Button onClick={handleResetPassword}>Send Email</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailOnly;
