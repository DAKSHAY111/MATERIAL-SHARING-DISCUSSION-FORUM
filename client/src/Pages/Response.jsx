import { Alert, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../Style/Signup.css";

const Response = () => {
  const [searchParams] = useSearchParams();
  const [response, setResponse] = useState("Processing");
  const [status] = useState(searchParams.get("status"));
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "201") {
      setResponse(`Your Account is Verified Successfully :)
      You will be automatically redirected to Login page`);
      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } else if (status === "100") {
      setResponse(`Your account is already verified!
      You will be automatically redirected to Login page`);
      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } else if (status === "401") {
      setResponse("Please login first to continue!");
    } else if (status === "403") {
      setResponse("Your verification link is expired!!");
    } else if (status === "404") {
      setResponse("User not exist with provided credentials!");
    } else if (status === "503") {
      setResponse(
        "Internal server error occurred while processing! Please try again :("
      );
    } else {
      setResponse("Request method is allowed!!");
    }
  }, [status, navigate]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "90vh",
        width: "100%",
        rowGap: "1rem",
      }}
      className="response-outer"
    >
      {status === "102" || status === "201" || status === "100" ? (
        <CircularProgress style={{ width: "50px", height: "50px" }} />
      ) : (
        ""
      )}
      <Alert
        style={{
          display: "flex",
          color:
            status === "102" || status === "201" || status === "100"
              ? "green"
              : "red",
          transform: "scale(1.3)",
          margin: ".7rem",
        }}
        severity={
          status === "102" || status === "201" || status === "100"
            ? "success"
            : "error"
        }
      >
        {response}
      </Alert>
    </div>
  );
};

export default Response;
