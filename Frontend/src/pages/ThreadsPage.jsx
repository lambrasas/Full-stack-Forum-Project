import React, { useEffect } from "react";
import InputField from "../components/InputField";
import { useState } from "react";
import { useUser } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
const ThreadsPage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/create-thread");
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleNavigate}>Create a new thread</button>
      </div>
    </>
  );
};

export default ThreadsPage;
