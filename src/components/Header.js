import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Header({ userType, setUserType }) {
  switch (userType) {
    case "admin":
      return (
        <Navbar bg="light" expand="lg">
          <LinkContainer style={{ marginLeft: "1rem" }} to="/">
            <Navbar.Brand>Orare ACS</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ marginRight: "1rem" }}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <NavButton text="Manage" path="/manage/users" />
            <NavButton text="Settings" path="/settings" />
            <NavButton text="Timetable" path="/manage/timetables" />
            <NavButton
              text="Log out"
              path="/"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUserType("");
              }}
            />
          </Navbar.Collapse>
        </Navbar>
      );
    case "student":
      return (
        <Navbar bg="light" expand="lg">
          <LinkContainer style={{ marginLeft: "1rem" }} to="/">
            <Navbar.Brand>Orare ACS</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ marginRight: "1rem" }}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <NavButton text="Settings" path="/settings" />

            <NavButton
              text="Log out"
              path="/"
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setUserType("");
              }}
            />
          </Navbar.Collapse>
        </Navbar>
      );
    default:
      return (
        <Navbar bg="light" expand="lg">
          <LinkContainer style={{ marginLeft: "1rem" }} to="/">
            <Navbar.Brand>Orare ACS</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ marginRight: "1rem" }}
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <NavButton text="Sign up / Sign in" path="/auth" />
          </Navbar.Collapse>
        </Navbar>
      );
  }
}

function NavButton({ text, path, onClick }) {
  return (
    <Nav>
      <LinkContainer
        style={{ paddingRight: "2rem", paddingLeft: "1rem" }}
        to={path}
        onClick={onClick}
      >
        <Nav.Link>{text}</Nav.Link>
      </LinkContainer>
    </Nav>
  );
}
