import React from "react";
import LoggedMain from "./Student/LoggedMain";
import logoImage from "../assets/logo.png";
import gradient from "../assets/gradient.png";

export default function Main({ userType, setUserType }) {
  switch (userType) {
    case "student":
      return <LoggedMain setUserType={setUserType} />;
    case "admin":
      return <LoggedMain setUserType={setUserType} />;
    default:
      return (
        <div
          className="d-flex align-items-center justify-content-center flex-column h-100"
          style={{
            backgroundImage: `url(${gradient})`,
            backgroundSize: "cover",
          }}
        >
          {/* <h1 className="mb-5">Welcome to the best timetable site!</h1> */}
          <img
            className="mt-5"
            style={{ borderRadius: "20px", border: "4px solid white" }}
            src={logoImage}
            alt=""
          ></img>
        </div>
      );
  }
}
