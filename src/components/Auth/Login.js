import { React, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import passwordImg from "../../assets/password.png";
import usernameImg from "../../assets/user.png";
import authcodeImg from "../../assets/authcode.png";
import axios from "axios";
import { toast } from "react-toastify";
import { getAccessRole } from "../../utils/tokens";
import { useNavigate } from "react-router-dom";

export default function Login({ setUserType }) {
  const [authCodeStage, setAuthCodeStage] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  let navigate = useNavigate();

  function checkFieldError(object, field) {
    if (!/^[0-9]+$/.test(object[field]["value"])) {
      toast.error("Code must contain only digits");
      return true;
    }

    if (object[field]["value"].length !== 6) {
      toast.error("Code must contain exactly 6 characters");
      return true;
    }

    return false;
  }

  function handleLogin(e) {
    e.preventDefault();

    let loginCheckCredentials = axios.post(
      "https://orareacs-backend.herokuapp.com/api/checkCredentials",
      {
        username: e.target.username.value,
        password: e.target.password.value,
      },
      { timeout: 20000 }
    );

    toast.promise(loginCheckCredentials, {
      pending: "Authentification in progress...",
      success: {
        render() {
          setAuthCodeStage(true);
          setUsername(e.target.username.value);
          setPassword(e.target.password.value);

          return "Valid credentials";
        },
      },
      error: {
        render(result) {
          if (
            result.data.response !== undefined &&
            result.data.response.data.message !== undefined
          )
            return result.data.response.data.message;
          else return "An error has occurred";
        },
      },
    });
  }

  function handle2FactorLogin(e) {
    e.preventDefault();

    if (checkFieldError(e.target, "authCode")) return;

    let loginCheckCodeForCredentials = axios.post(
      "https://orareacs-backend.herokuapp.com/api/login",
      {
        username: username,
        password: password,
        code: parseInt(e.target.authCode.value),
      },
      { timeout: 20000 }
    );

    toast.promise(loginCheckCodeForCredentials, {
      pending: "Authentification in progress...",
      success: {
        render(result) {
          localStorage.setItem("accessToken", result.data.data.accessToken);
          localStorage.setItem("refreshToken", result.data.data.refreshToken);
          setUserType(getAccessRole(result.data.data.accessToken));

          navigate("/");

          return "Login successfully 🎉";
        },
      },
      error: {
        render(result) {
          if (
            result.data.response !== undefined &&
            result.data.response.data.message !== undefined
          )
            return result.data.response.data.message;
          else return "An error has occurred";
        },
      },
    });
  }

  if (!authCodeStage) {
    return (
      <Card.Body style={{ paddingLeft: "0.3rem" }}>
        <Form onSubmit={handleLogin}>
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
    );
  } else {
    return (
      <Card.Body
        style={{
          display: "grid",
          justifyItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="text-center">
          Introduce the code generated on your mobile app.
        </p>
        <Form
          onSubmit={handle2FactorLogin}
          style={{
            display: "grid",
            justifyItems: "center",
            justifyContent: "center",
          }}
        >
          <Form.Group controlId="formLoginCode" className="mb-3">
            <FormField src={authcodeImg} name="authCode" placeholder="Code" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Card.Body>
    );
  }
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
