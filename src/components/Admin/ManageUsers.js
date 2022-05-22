import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "../../styles/Manage.css";
import ReactFlexyTable from "react-flexy-table";
import "react-flexy-table/dist/index.css";
import deleteImg from "../../assets/delete.png";
import editImg from "../../assets/edit.png";
import { toast } from "react-toastify";
import { getAccessRole, revalidateAccessToken } from "../../utils/tokens";

export default function ManageUsers({ userType, setUserType }) {
  const [dataTable, setDataTable] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [groups, setGroups] = useState([]);
  const roles = ["student", "admin"];

  function fetchUsers() {
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
        return;

      let getUsers = axios.get(
        "https://orareacs-backend.herokuapp.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );
      getUsers
        .then((res) => setDataTable(res.data))
        .catch((err) => console.log(err));
    });
  }

  function fetchGroups() {
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
        return;

      let getGroups = axios.get(
        "https://orareacs-backend.herokuapp.com/api/getGroups",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );
      getGroups
        .then((res) => setGroups(res.data))
        .catch((err) => console.log(err));
    });
  }

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  function handleDelete(data) {
    alert('The user "' + data.username + '" is about to be deleted!');

    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
        return;

      let deletePromise = axios.delete(
        "https://orareacs-backend.herokuapp.com/api/user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          data: {
            username: data.username,
          },
          timeout: 30000,
        }
      );

      // A toast notification that waits for backend response before showing a message
      toast.promise(deletePromise, {
        pending: "Delete in progres...",
        success: {
          render(result) {
            fetchUsers();
            return "User successfully deleted 🎉";
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

  function updateUser(e) {
    e.preventDefault();

    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
        return;

      if (checkFieldError(e.target, ["firstName", "lastName"])) return;

      if (e.target.firstName.value !== "")
        selectedUser.firstName = e.target.firstName.value;
      if (e.target.lastName.value !== "")
        selectedUser.lastName = e.target.lastName.value;

      if (e.target.email.value !== "")
        selectedUser.email = e.target.email.value;
      if (e.target.group.value !== "default")
        selectedUser.group = e.target.group.value;
      if (e.target.role.value !== "") selectedUser.role = e.target.role.value;

      let updatePromise = axios.put(
        "https://orareacs-backend.herokuapp.com/api/user",
        {
          username: selectedUser.username,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          role: selectedUser.role,
          email: selectedUser.email,
          group: selectedUser.group,
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
            setShowModal(false);
            fetchUsers();
            return "User successfully updated 🎉";
          },
        },
        error: {
          render(result) {
            setShowModal(false);
            if (result.data.response !== undefined)
              return result.data.response.data.message;
            else return "An error has occurred";
          },
        },
      });
    });
  }

  function handleEdit(data) {
    setShowModal(true);
    setSelectedUser(data);
  }

  const additionalCols = [
    {
      header: "Actions",
      td: (data) => {
        return (
          <div>
            <img
              src={deleteImg}
              alt=""
              width="25"
              height="20"
              onClick={() => handleDelete(data)}
            />{" "}
            <img
              src={editImg}
              alt=""
              width="20"
              height="20"
              onClick={() => handleEdit(data)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ReactFlexyTable
        data={dataTable}
        additionalCols={additionalCols}
        sortable
        filterable
        caseSensitive
        nonFilterCols={["role", "email", "group"]}
      />
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit user {selectedUser.username}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={updateUser}>
          <Modal.Body>
            <Form.Group controlId="formRole" className="mb-3">
              <label>Role</label>
              <div className="d-flex align-items-center">
                <Form.Select
                  required
                  name="role"
                  defaultValue={selectedUser.role}
                >
                  {roles.map((element) => {
                    return (
                      <option key={element} value={element}>
                        {element}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group controlId="formFirstName" className="mb-2">
              <label>First name</label>
              <input
                type="firstName"
                name="firstName"
                className="form-control"
                placeholder={selectedUser.firstName}
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mb-2">
              <label>Last name</label>
              <input
                type="lastName"
                name="lastName"
                className="form-control"
                size="sm"
                placeholder={selectedUser.lastName}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                size="sm"
                placeholder={selectedUser.email}
              />
            </Form.Group>
            <Form.Group controlId="formGroup" className="mb-3">
              <label>Group</label>
              <div className="d-flex align-items-center">
                <Form.Select
                  required
                  name="group"
                  defaultValue={selectedUser.group}
                >
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
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
}
