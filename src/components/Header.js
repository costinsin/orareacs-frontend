import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer style={{ marginLeft: "1rem" }} to="/">
        <Navbar.Brand>Orare ACS</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        style={{ marginRight: "1rem" }}
      />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <LinkContainer
            style={{ paddingRight: "2rem", paddingLeft: "1rem" }}
            to="/login"
          >
            <Nav.Link>Login</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
