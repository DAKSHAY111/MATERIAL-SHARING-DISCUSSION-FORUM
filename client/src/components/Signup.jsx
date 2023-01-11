import React, { useState } from "react";
import { Button, Checkbox, TextField } from "@mui/material";
import google from "../static/google.png";

import "../Style/Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    
  }

  return (
    <div className="signup-outer">
      <div className="signup-wrapper">
        <div className="flex-center-wrapper row-gap-2">
          <div className="company-title">
            <img id="company-logo" src={google} alt="GoogleLogo" />
          </div>
          <div className="page-title">Create Account</div>
          <div className="signup-form">
            <div className="input-item">
              <TextField
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="custom-input-field"
                type="text"
                variant="outlined"
                label="Username"
                margin="dense"
                id="input-name"
                required
              />
            </div>
            <div className="input-item">
              <TextField
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="custom-input-field"
                type="email"
                variant="outlined"
                label="Email"
                margin="dense"
                id="input-email"
                autoComplete="off"
                required
              />
            </div>
            <div className="input-item">
              <TextField
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="custom-input-field"
                type="password"
                variant="outlined"
                label="Password"
                margin="dense"
                id="input-password"
                required
              />
            </div>

            <div className="terms-and-policy">
              <Checkbox defaultChecked required size="small" />
              <a href="/terms_of_service">Term's of service</a> &{" "}
              <a href="/policy">Policy</a>
            </div>

            <div className="button-group">
              <Button onClick={() => navigate('/login')} variant="text">Sign in</Button>
              <Button onClick={handleSignup} variant="contained" disableElevation>
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;