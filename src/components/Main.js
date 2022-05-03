import React from "react";
import StudentMain from "./Student/StudentMain";

export default function Main({ userType, setUserType }) {
  switch (userType) {
    case "student":
      return <StudentMain userType={userType} setUserType={setUserType} />;
    default:
      return <h1>Main</h1>;
  }
}
