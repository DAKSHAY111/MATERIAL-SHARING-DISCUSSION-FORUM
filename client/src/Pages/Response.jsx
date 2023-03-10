import { Alert, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../style/Signup.css";

const Response = (props) => {
  const [response, setResponse] = useState(props?.response || "Processing");
  const [isNavigate, setIsNavigate] = useState(props?.navigate || false);
  const [isError, setIsError] = useState(props?.isError || false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(searchParams.get("message")) setResponse(searchParams.get("message"));
    if (searchParams.get("navigate")) {
      setIsNavigate(searchParams.get("navigate"));
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
    if (searchParams.get("error")) setIsError(searchParams.get("error") === "true");
  }, [navigate, isNavigate, searchParams]);
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
      {isNavigate ? (
        <CircularProgress style={{ width: "50px", height: "50px" }} />
      ) : (
        ""
      )}
      <Alert
        style={{
          display: "flex",
          color: isError ? "red" : "green",
          transform: "scale(1.3)",
          margin: ".7rem",
        }}
        severity={isError ? "error" : "success"}
      >
        {response}
      </Alert>
    </div>
  );
};

export default Response;
