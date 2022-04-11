import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Login from './components/Login';
import Main from './components/Main';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path="/" element={<Main/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  )
}

