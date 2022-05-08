import { React, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Auth from "./components/Auth/Auth";
import Main from "./components/Main";
import Settings from "./components/Student/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAccessRole, revalidateAccessToken } from "./utils/tokens";
import moment from "moment";

moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});

export default function App() {
  const [userType, setUserType] = useState("");

  useEffect(() => {
    revalidateAccessToken().then(() => {
      let accessToken = localStorage.getItem("accessToken");

      setUserType(getAccessRole(accessToken));
    });
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Router>
        <Header userType={userType} setUserType={setUserType} />
        <Routes>
          <Route
            exact
            path="/"
            element={<Main userType={userType} setUserType={setUserType} />}
          />
          <Route path="/auth" element={<Auth setUserType={setUserType} />} />
          <Route path="/settings" element={<Settings setUserType={setUserType}/>} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}
