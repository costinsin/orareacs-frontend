import React from "react";
import LoggedMain from "./Student/LoggedMain";

export default function Main({ userType, setUserType }) {
  switch (userType) {
    case "student":
      return <LoggedMain setUserType={setUserType} />;
    case "admin":
      return <LoggedMain setUserType={setUserType} />;
    default:
      return <h1>Main</h1>;
  }
}
