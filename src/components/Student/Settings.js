import { React, useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import "../../styles/Settings.css";
import axios from "axios";
import { getAccessRole, revalidateAccessToken } from "../../utils/tokens";
import { toast } from "react-toastify";
import usernameImg from "../../assets/view_user.png";
import idcardImg from "../../assets/id-card.png";
import emailImg from "../../assets/view_email.png";
import groupImg from "../../assets/multiple_users.png";

export default function Settings({ userType, setUserType }) {
  const groups = ["335CCa", "335CCb", "312CAb"];
  const [username, setUsername] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [group, setGroup] = useState(null);
  const [role, setRole] = useState(null);

  function fetchUserData(displayToast) {
    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "student")
        return;

      let getDetails = axios.get(
        "https://orareacs-backend.herokuapp.com/api/getDetails",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      if (displayToast) {
        toast.promise(getDetails, {
          pending: "Loading details...",
          success: {
            render(result) {
              setUsername(result.data.data.username);
              setFirstName(result.data.data.firstName);
              setLastName(result.data.data.lastName);
              setEmail(result.data.data.email);
              setGroup(result.data.data.group);
              setRole(result.data.data.role);
              return "Details loaded successfully";
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
      } else {
        getDetails
          .then((result) => {
            setUsername(result.data.username);
            setFirstName(result.data.firstName);
            setLastName(result.data.lastName);
            setEmail(result.data.email);
            setGroup(result.data.group);
            setRole(result.data.role);
          })
          .catch((result) => {});
      }
    });
  }

  useEffect(() => fetchUserData(true), []);

  function checkFieldError(object, fields) {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] === "firstName") {
        if (
          object[fields[i]]["value"].length !== 0 &&
          !/^[a-zA-Z]+$/.test(object[fields[i]]["value"])
        ) {
          toast.error("First name must contain only letters");
          return true;
        }
      }

      if (fields[i] === "lastName") {
        if (
          object[fields[i]]["value"].length !== 0 &&
          !/^[a-zA-Z]+$/.test(object[fields[i]]["value"])
        ) {
          toast.error("Last name must contain only letters");
          return true;
        }
      }
    }
    return false;
  }

  function handleUpdate(e) {
    e.preventDefault();

    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "student")
        return;

      if (checkFieldError(e.target, ["firstName", "lastName", "password"]))
        return;

      let jsonfirstName = null;
      let jsonlastName = null;
      let jsonemail = null;
      let jsonpassword = null;
      let jsongroup = null;

      if (e.target.firstName.value !== "")
        jsonfirstName = e.target.firstName.value;
      if (e.target.lastName.value !== "")
        jsonlastName = e.target.lastName.value;

      if (e.target.email.value !== "") jsonemail = e.target.email.value;
      if (e.target.group.value !== "default") jsongroup = e.target.group.value;
      if (e.target.password.value !== "")
        jsonpassword = e.target.password.value;

      let updatePromise = axios.put(
        "https://orareacs-backend.herokuapp.com/api/updateDetails",
        {
          firstName: jsonfirstName,
          lastName: jsonlastName,
          password: jsonpassword,
          email: jsonemail,
          group: jsongroup,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      // A toast notification that waits for backend response before showing a message
      toast.promise(updatePromise, {
        pending: "Update in progres...",
        success: {
          render(result) {
            fetchUserData(false);
            return "Account successfully updated 🎉";
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
    });
  }

  return (
    <div className="settings-mainback">
      <Container className="settings-container">
        <Card style={{ width: "40%" }}>
          <Card.Body>
            <h1 className="settings-heading">Profile Details</h1>
            <h4>{role}</h4>

            <Row className="settings-profileContainer">
              <Col>
                <img src={usernameImg} alt="" className="settings-img" />
                Username
              </Col>
              <Col className="settings-description">{username}</Col>
              <hr />
            </Row>
            <Row className="settings-profileContainer">
              <Col>
                <img src={idcardImg} alt="" className="settings-img" />
                First Name
              </Col>
              <Col className="settings-description">{firstName}</Col>
              <hr />
            </Row>
            <Row className="settings-profileContainer">
              <Col>
                <img src={idcardImg} alt="" className="settings-img" />
                Last Name
              </Col>
              <Col className="settings-description">{lastName}</Col>
              <hr />
            </Row>
            <Row className="settings-profileContainer">
              <Col>
                <img src={emailImg} alt="" className="settings-img" />
                Email
              </Col>
              <Col className="settings-description">{email}</Col>
              <hr />
            </Row>
            <Row className="settings-profileContainer">
              <Col>
                <img src={groupImg} alt="" className="settings-img" />
                Group
              </Col>
              <Col className="settings-description">{group}</Col>
              <hr />
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ width: "45%", display: "grid", alignItems: "center" }}>
          <Card.Body>
            <h1 className="settings-heading">Edit Profile</h1>

            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="formFirstName" className="mb-2">
                <label>First name</label>
                <input
                  type="firstName"
                  name="firstName"
                  className="form-control"
                  placeholder={firstName}
                />
              </Form.Group>
              <Form.Group controlId="formLastName" className="mb-2">
                <label>Last name</label>
                <input
                  type="lastName"
                  name="lastName"
                  className="form-control"
                  size="sm"
                  placeholder={lastName}
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-2">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  size="sm"
                  placeholder={email}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-2">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter new password"
                />
              </Form.Group>
              <Form.Group controlId="formGroup" className="mb-3">
                <label>Group</label>
                <div className="d-flex align-items-center">
                  <Form.Select required name="group" defaultValue={"default"}>
                    <option value="default" disabled>
                      {group}
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
                controlId="formRegister"
                style={{
                  display: "grid",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
