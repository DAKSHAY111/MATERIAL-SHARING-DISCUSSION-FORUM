import { TextField, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import google from "../static/google.png";
import "../Style/Signup.css";

const Login = () => {
  const [loginInputEmail, setLoginInputEmail] = useState("");
  const [loginInputPassword, setLoginInputPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {}

  return (
    <div className="signup-outer">
      <div className="signup-wrapper">
        <div className="flex-center-wrapper row-gap-2">
          <div className="company-title">
            <img id="company-logo" src={google} alt="GoogleLogo" />
          </div>
          <div className="page-title">Sign in</div>
          <div className="signup-form">
            <div className="input-item">
              <TextField
                id="login-input-email"
                className="custom-input-field"
                value={loginInputEmail}
                onChange={(e) => setLoginInputEmail(e.target.value)}
                type="email"
                required
                variant="outlined"
                label="Email"
                margin="dense"
                autoComplete="off"
              />
            </div>
            <div className="input-item">
              <TextField
                label="Password"
                type="password"
                value={loginInputPassword}
                onChange={(e) => setLoginInputPassword(e.target.value)}
                id="login-input-password"
                className="custom-input-field"
                required
                variant="outlined"
                margin="dense"
              />
            </div>

            <div className="forgot-password-outer">
                <a href="/forgot/password">Forgot password?</a>
            </div>

            <div className="button-group">
              <Button onClick={() => navigate('/signup')} variant="text">Sign up</Button>
              <Button onClick={handleLogin} variant="contained" disableElevation>
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;