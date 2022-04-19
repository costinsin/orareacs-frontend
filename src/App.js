import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Auth from "./components/Auth/Auth";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}
