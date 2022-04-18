import { React, useState } from "react";
import { Card, Container, Tabs, Tab } from "react-bootstrap";
import "../../styles/Login.css";
import Register from "./Register";
import Login from "./Login";

export default function Auth() {
  const [authState, setAuthState] = useState("login");

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
            <Login />
          </Tab>
          <Tab eventKey="register" title="Register">
            <Register setAuthState={setAuthState} />
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
}
