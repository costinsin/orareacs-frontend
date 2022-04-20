import { React, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import passwordImg from "../../assets/password.png";
import usernameImg from "../../assets/user.png";
import idImg from "../../assets/id.png";
import emailImg from "../../assets/email.png";
import groupImg from "../../assets/group.png";
import axios from "axios";
import { toast } from "react-toastify";

export default function Register({ setAuthState }) {
  const [twoFactorStage, setTwoFactorStage] = useState(false);
  let [secretImage, setSecretImage] = useState("");

  // TODO: Make a database request to get the user's groups
  const groups = ["331CC", "332CC", "333CC", "334CC", "335CC", "336CC"];

  function checkFieldError(object, fields) {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] === "username") {
        if (object[fields[i]]["value"].length < 3) {
          toast.error("Username must contain at least 3 characters");
          return true;
        }
        if (!/^[A-Za-z]{1,1}$/.test(object[fields[i]]["value"][0])) {
          toast.error("Username must start with a letter");
          return true;
        }
      }

      if (fields[i] === "firstname") {
        if (!/^[a-zA-Z]+$/.test(object[fields[i]]["value"])) {
          toast.error("First name must contain only letters");
          return true;
        }
      }

      if (fields[i] === "lastname") {
        if (!/^[a-zA-Z]+$/.test(object[fields[i]]["value"])) {
          toast.error("Last name must contain only letters");
          return true;
        }
      }

      if (fields[i] === "group") {
        if (object[fields[i]]["value"] === "default") {
          toast.error("Please select a group");
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

    let registerPromise = axios.post(
      "https://orareacs-backend.herokuapp.com/api/register",
      {
        username: e.target.username.value,
        firstName: e.target.firstname.value,
        lastName: e.target.lastname.value,
        password: e.target.password.value,
        email: e.target.email.value,
        group: e.target.group.value,
      },
      { timeout: 20000 }
    );

    // A toast notification that waits for backend response before showing a message
    toast.promise(registerPromise, {
      pending: "Registering in progress...",
      success: {
        render(result) {
          setTwoFactorStage(true);
          setSecretImage(result.data.data["secretImage"]);

          return "Account successfully created 🎉";
        },
      },
      error: {
        render(result) {
          if (result.data.response !== undefined)
            return result.data.response.data.message;
          else return "An error has occurred";
        },
      },
    });
  }

  if (twoFactorStage) {
    return (
      <Card.Body
        style={{
          display: "grid",
          justifyItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="text-center">
          Install an Authenticator app (eg. Google Authenticator, Microsoft
          Authenticator) on your mobile phone and scan this QR code. You will
          need the Authenticator codes for future logins.
        </p>
        <img
          src={secretImage}
          style={{ height: "16rem", margin: "auto" }}
          alt=""
        />
        <Button
          onClick={() => {
            setTwoFactorStage(false);
          }}
          className="mt-3"
        >
          Register another account
        </Button>
      </Card.Body>
    );
  } else {
    return (
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
          <Form.Group controlId="formRegister">
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form.Group>
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
