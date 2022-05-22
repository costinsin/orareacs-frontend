import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAccessRole, revalidateAccessToken } from "../../utils/tokens";
import ReactFlexyTable from "react-flexy-table";
import deleteImg from "../../assets/delete.png";
import editImg from "../../assets/edit.png";
import "../../styles/Manage.css";
import { toast } from "react-toastify";
import { Modal, Form } from "react-bootstrap";
import { Editor, EditorState, ContentState, convertToRaw } from "draft-js";

export default function TimetableEdit({ userType, setUserType }) {
  const [dataTable, setDataTable] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [jsonText, setJsonText] = useState(null);

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
        .then((res) => {
          setDataTable(
            res.data.map((e) => {
              return {
                Group: e,
              };
            })
          );
        })
        .catch((err) => console.log(err));
    });
  }

  useEffect(() => fetchGroups(), []);

  function handleDelete(data) {
    alert('Timetable for group "' + data.Group + '" is about to be deleted!');

    // Revalidate token if it expired
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
        return;

      let deletePromise = axios.delete(
        `https://orareacs-backend.herokuapp.com/api/timetable/${data.Group}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          timeout: 30000,
        }
      );

      // A toast notification that waits for backend response before showing a message
      toast.promise(deletePromise, {
        pending: "Delete in progres...",
        success: {
          render(result) {
            fetchGroups();
            return "Timetable successfully deleted 🎉";
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

  function handleUpload(e) {
    e.preventDefault();
    let fileText = null;

    if (isSelected) {
      revalidateAccessToken().then(() => {
        // Update the user type depending on the revalidation result
        setUserType(getAccessRole(localStorage.getItem("accessToken")));

        // If user was logged out, don't contiune with fetching the timetable
        if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
          return;

        const reader = new FileReader();
        reader.onload = (e) => {
          fileText = e.target.result;
          let uploadPromise = axios.post(
            "https://orareacs-backend.herokuapp.com/api/timetable",
            JSON.parse(fileText),
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              timeout: 30000,
            }
          );

          // A toast notification that waits for backend response before showing a message
          toast.promise(uploadPromise, {
            pending: "Upload in progres...",
            success: {
              render(result) {
                fetchGroups();
                return "Timetable successfully uploaded 🎉";
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
        };
        reader.readAsText(selectedFile);
        console.log(fileText);
      });
    } else {
      alert("No files selected !");
    }
  }

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  function handleEdit(data) {
    setShowModal(true);
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(jsonText))
    );
    setSelectedGroup(data.Group);
  }

  function updateTimetable() {
    revalidateAccessToken().then(() => {
      // Update the user type depending on the revalidation result
      setUserType(getAccessRole(localStorage.getItem("accessToken")));

      // If user was logged out, don't contiune with fetching the timetable
      if (getAccessRole(localStorage.getItem("accessToken")) !== "admin")
        return;

      const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
      const value = blocks
        .map((block) => (!block.text.trim() && "\n") || block.text)
        .join("\n");
      setJsonText(value);

      // let updatePromise = axios.put(
      //   "https://orareacs-backend.herokuapp.com/api/timetable",
      //   JSON.parse(jsonText),
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //     },
      //     timeout: 30000,
      //   }
      // );

      // // A toast notification that waits for backend response before showing a message
      // toast.promise(updatePromise, {
      //   pending: "Update in progres...",
      //   success: {
      //     render(result) {
      //       fetchGroups();
      //       return "Timetable successfully updated 🎉";
      //     },
      //   },
      //   error: {
      //     render(result) {
      //       if (result.data.response !== undefined)
      //         return result.data.response.data.message;
      //       else return "An error has occurred";
      //     },
      //   },
      // });
      setShowModal(false);
    });
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
      <div className="manage-page">
        <input type="file" className="manage-input" onChange={changeHandler} />
        <button className="manage-button" onClick={handleUpload}>
          Upload
        </button>
      </div>

      <ReactFlexyTable
        data={dataTable}
        additionalCols={additionalCols}
        className="manage-table"
      />
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit timetable for group </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="json" className="mb-2">
              <Editor editorState={editorState} onChange={setEditorState} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="manage-button" onClick={updateTimetable}>
            Edit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
