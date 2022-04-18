import { React, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import passwordImg from "../../assets/password.png";
import usernameImg from "../../assets/user.png";
import idImg from "../../assets/id.png";
import emailImg from "../../assets/email.png";
import groupImg from "../../assets/group.png";
import axios from "axios";

export default function Register({ setAuthState }) {
  const [errorMessage, setErrorMessage] = useState(null);
  // TODO: Make a database request to get the user's groups
  const groups = ["331CC", "332CC", "333CC", "334CC", "335CC", "336CC"];

  function checkFieldError(object, fields) {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] === "username") {
        if (object[fields[i]]["value"].length < 3) {
          setErrorMessage("Username must contain at least 3 characters");
          return true;
        }
        if (!/^[A-Za-z]{1,1}$/.test(object[fields[i]]["value"][0])) {
          setErrorMessage("Username must start with a letter");
          return true;
        }
      }

      if (fields[i] === "firstname") {
        if (/[0-9]/.test(object[fields[i]]["value"])) {
          setErrorMessage("First name must contain only letters");
          return true;
        }
      }

      if (fields[i] === "lastname") {
        if (/[0-9]/.test(object[fields[i]]["value"])) {
          setErrorMessage("Last name must contain only letters");
          return true;
        }
      }

      if (fields[i] === "group") {
        if (object[fields[i]]["value"] === "default") {
          setErrorMessage("Please select a group");
          return true;
        }
      }
    }

    return false;
  }

  function handleRegister(e) {
    e.preventDefault();

    if (
      checkFieldError(e.target, [
        "username",
        "firstname",
        "lastname",
        "password",
        "email",
        "group",
      ])
    )
      return;

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
        setErrorMessage(null);
        setAuthState("login");
        console.log(res);
      })
      .catch((err) => {
        setErrorMessage("Username already exists");
        console.log(err);
      });
  }

  return (
    <Card.Body style={{ paddingLeft: "0.3rem" }}>
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="formUsername" className="mb-2">
          <FormField src={usernameImg} name="username" placeholder="Username" />
        </Form.Group>
        <Form.Group controlId="formFirstName" className="mb-2">
          <FormField src={idImg} name="firstname" placeholder="First name" />
        </Form.Group>
        <Form.Group controlId="formLastName" className="mb-2">
          <FormField src={idImg} name="lastname" placeholder="Last name" />
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
            <Form.Select required name="group" defaultValue={"default"}>
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
        <Form.Group
          controlId="formErorr"
          hidden={errorMessage ? false : true}
          className="mb-3"
        >
          <p style={{ color: "red" }}>{errorMessage}</p>
        </Form.Group>
        <Form.Group controlId="formRegister">
          <Button variant="primary" type="submit">
            Register
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
