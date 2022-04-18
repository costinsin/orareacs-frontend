import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import passwordImg from "../../assets/password.png";
import usernameImg from "../../assets/user.png";

export default function Login() {
  return (
    <Card.Body style={{ paddingLeft: "0.3rem" }}>
      <Form /*onSubmit={handleLogin}*/>
        <Form.Group controlId="formLoginUsername" className="mb-3">
          <FormField src={usernameImg} name="username" placeholder="Username" />
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
  );
}

function FormIcon({ src }) {
  return <img src={src} className="form-icon" alt="" />;
}

function FormField({ src, name, placeholder, type = "text" }) {
  return (
    <div className="d-flex align-items-center">
      <FormIcon src={src} />
      <Form.Control
        required
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
