import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmailOnly from "./EmailOnly";

import "../style/Forgot.css";
import "../style/Signup.css";

const ForgotPassword = () => {
  const [filterParameter, setFilterParameter] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setFilterParameter(searchParams.get("index"));
  }, [searchParams]);
  return (
    <div className="flex-center">
      {filterParameter === "password" ? <EmailOnly /> : ""}
    </div>
  );
};

export default ForgotPassword;
