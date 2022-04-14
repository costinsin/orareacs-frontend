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
  const [authState, setAuthState] = useState("login");
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
      })
      .catch((err) => {
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
          activeKey={authState}
          onSelect={(k) => setAuthState(k)}
          className="mb-3"
        >
          <Tab eventKey="login" title="Login">
            <Card.Body style={{ paddingLeft: "0.3rem" }}>
              <Form /*onSubmit={handleLogin}*/>
                <Form.Group controlId="formLoginUsername" className="mb-3">
                  <FormField
                    src={usernameImg}
                    name="username"
                    placeholder="Username"
                  />
                </Form.Group>
                <Form.Group controlId="formLoginPassword" className="mb-3">
                  <FormField
                    src={passwordImg}
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
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
                  <FormField
                    src={usernameImg}
                    name="username"
                    placeholder="Username"
                  />
                </Form.Group>
                <Form.Group controlId="formFirstName" className="mb-2">
                  <FormField
                    src={idImg}
                    name="firstname"
                    placeholder="First name"
                  />
                </Form.Group>
                <Form.Group controlId="formLastName" className="mb-2">
                  <FormField
                    src={idImg}
                    name="lastname"
                    placeholder="Last name"
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mb-2">
                  <FormField
                    src={emailImg}
                    name="email"
                    type="email"
                    placeholder="Email address"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-2">
                  <FormField
                    src={passwordImg}
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
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

function FormField({ src, name, placeholder, type = "text" }) {
  return (
    <div className="d-flex align-items-center">
      <FormIcon src={src} />
      <Form.Control name={name} type={type} placeholder={placeholder} />
    </div>
  );
}
