import { React, useState } from "react";
import { Button, Card, Container, Form, Tabs, Tab } from "react-bootstrap";
import "../styles/Login.css";
import passwordImg from "../assets/password.png";
import usernameImg from "../assets/user.png";
import idImg from "../assets/id.png";
import emailImg from "../assets/email.png";
import groupImg from "../assets/group.png";
import axios from "axios";

export default function Login() {
  const [key, setKey] = useState("login");
  // TODO: Make a database request to get the user's groups
  const groups = ["331CC", "332CC", "333CC", "334CC", "335CC", "336CC"];

  function handleRegister(e) {
    e.preventDefault();
    axios
      .post("https://orareacs-backend.herokuapp.com/api/register", {
        username: e.target.username.value,
        firstName: e.target.firstname.value,
        lastName: e.target.lastname.value,
        password: e.target.password.value,
        email: e.target.email.value,
        group: e.target.group.value,
      })
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Card className="login-card" style={{ minWidth: "300px" }}>
        <Tabs
          id="controlled-tab"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="login" title="Login">
            <Card.Body style={{ paddingLeft: "0.3rem" }}>
              <Form /*onSubmit={handleLogin}*/>
                <Form.Group controlId="formLoginUsername" className="mb-3">
                  <div className="d-flex align-items-center">
                    <FormIcon src={usernameImg} />
                    <Form.Control type="text" placeholder="Username" />
                  </div>
                </Form.Group>
                <Form.Group controlId="formLoginPassword" className="mb-3">
                  <div className="d-flex align-items-center">
                    <FormIcon src={passwordImg} />
                    <Form.Control type="password" placeholder="Password" />
                  </div>
                </Form.Group>
                <Form.Group controlId="formLogin" className="mb-3">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Tab>
          <Tab eventKey="register" title="Register">
            <Card.Body style={{ paddingLeft: "0.3rem" }}>
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formUsername" className="mb-2">
                  <div className="d-flex align-items-center">
                    <FormIcon src={usernameImg} />
                    <Form.Control
                      name="username"
                      type="text"
                      placeholder="Username"
                      autoComplete="false"
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formFirstName" className="mb-2">
                  <div className="d-flex align-items-center">
                    <FormIcon src={idImg} />
                    <Form.Control
                      name="firstname"
                      type="text"
                      placeholder="First name"
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formLastName" className="mb-2">
                  <div className="d-flex align-items-center">
                    <FormIcon src={idImg} />
                    <Form.Control
                      name="lastname"
                      type="text"
                      placeholder="Last name"
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formEmail" className="mb-2">
                  <div className="d-flex align-items-center">
                    <FormIcon src={emailImg} />
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Email address"
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-2">
                  <div className="d-flex align-items-center">
                    <FormIcon src={passwordImg} />
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                </Form.Group>
                <Form.Group controlId="formGroup" className="mb-3">
                  <div className="d-flex align-items-center">
                    <FormIcon src={groupImg} />
                    <Form.Select name="group" defaultValue={"default"}>
                      <option value="default" disabled>
                        Select a group
                      </option>
                      {groups.map((element) => {
                        return (
                          <option key={element} value={element}>
                            {element}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </div>
                </Form.Group>
                <Form.Group controlId="formRegister">
                  <Button variant="primary" type="submit">
                    Register
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
}

function FormIcon({ src }) {
  return <img src={src} className="form-icon" alt="" />;
}
