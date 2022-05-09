import React, { useState } from "react";
import {
  Button,
  Container,
  ListGroup,
  CloseButton,
  Modal,
  Form,
} from "react-bootstrap";
import ruletypeImg from "../../../assets/ruletype.png";
import courseImg from "../../../assets/course.png";
import freqImg from "../../../assets/frequency.png";
import calendarImg from "../../../assets/calendar.png";
import hourImg from "../../../assets/hours.png";
import addImg from "../../../assets/add.png";
import removeImg from "../../../assets/remove.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RuleContainer({ ruleList, addRule, deleteRule }) {
  return (
    <Container>
      <RuleHeader addRule={addRule} />
      <RuleList ruleList={ruleList} deleteRule={deleteRule} />
    </Container>
  );
}

function RuleList({ ruleList, deleteRule }) {
  return (
    <ListGroup className="overflow-auto" style={{ height: "400px" }}>
      {ruleList.map((rule) => (
        <Rule key={rule.id} rule={rule} deleteRule={deleteRule} />
      ))}
    </ListGroup>
  );
}

function Rule({ rule, deleteRule }) {
  function frequencyDescriprion(course) {
    let startDate = new Date(course.startDate);
    let dayName = startDate.toLocaleDateString("en-GB", {
      weekday: "long",
    });
    let formattedStartDate = startDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    let formattedEndDate = new Date(course.endDate).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

    switch (course.frequency) {
      case "weekly":
        return "Each " + dayName + " until " + formattedEndDate;

      case "even":
        return "Even " + dayName + "s until" + formattedEndDate;

      case "odd":
        return "Odd " + dayName + "s until" + formattedEndDate;

      case "once":
        return "Once on " + formattedStartDate;

      default:
        return "";
    }
  }

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img
          src={rule.type === "add" ? addImg : removeImg}
          className="form-icon me-3"
          alt=""
        />
        <div>
          <u>
            <h5>{rule.course.name}</h5>
          </u>
          <p className="my-0">
            {rule.course.startHour + "-" + rule.course.endHour}
          </p>
          <p className="my-0">{frequencyDescriprion(rule.course)}</p>
        </div>
      </div>
      <CloseButton onClick={() => deleteRule(rule)} />
    </ListGroup.Item>
  );
}

function RuleHeader({ addRule }) {
  const [showModal, setShowModal] = useState(false);
  const [addRuleType, setAddRuleType] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startHour, setStartHour] = useState(new Date());
  const [endHour, setEndHour] = useState(new Date());

  return (
    <>
      <Button className="mb-4" onClick={() => setShowModal(true)}>
        Add Rule
      </Button>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setAddRuleType(true);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a new customization rule</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();

            const startDate = new Date(
              Date.parse(e.target.formStartDate.value)
            );
            const endDate = new Date(Date.parse(e.target.formEndDate.value));

            if (addRuleType) {
              addRule({
                type: "add",
                course: {
                  name: e.target.formCourseName.value,
                  type: "custom",
                  frequency: e.target.formRuleFreq.value,
                  startDate: new Date(
                    startDate.getTime() -
                      startDate.getTimezoneOffset() * 60 * 1000
                  ),
                  endDate: new Date(
                    endDate.getTime() - endDate.getTimezoneOffset() * 60 * 1000
                  ),
                  startHour: e.target.formStartHour.value,
                  endHour: e.target.formEndHour.value,
                },
              });
            }
            setShowModal(false);
          }}
        >
          <Modal.Body>
            <Form.Group controlId="formRuleType" className="mb-3">
              <div className="d-flex align-items-center">
                <img src={ruletypeImg} className="form-icon" alt="" />
                <Form.Select
                  required
                  name="ruleType"
                  onChange={(e) => {
                    if (e.target.value === "add") {
                      setAddRuleType(true);
                    } else {
                      setAddRuleType(false);
                    }
                  }}
                >
                  <option default value="add">
                    Add custom course
                  </option>
                  <option value="remove">Remove existent course</option>
                </Form.Select>
              </div>
            </Form.Group>
            <hr />
            {addRuleType && (
              <>
                <Form.Group controlId="formCourseName" className="mb-3">
                  <FormField
                    src={courseImg}
                    name="courseName"
                    placeholder="Course name"
                  />
                </Form.Group>
                <Form.Group controlId="formRuleFreq" className="mb-3">
                  <div className="d-flex align-items-center">
                    <img src={freqImg} className="form-icon" alt="" />
                    <Form.Select required name="ruleFreq">
                      <option default value="weekly">
                        Weekly
                      </option>
                      <option value="even">Even week</option>
                      <option value="odd">Odd week</option>
                      <option value="once">Once</option>
                    </Form.Select>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <img src={calendarImg} className="form-icon" alt="" />
                    <div style={{ width: "100px" }}>Start Date</div>
                    <DatePicker
                      id="formStartDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <img src={calendarImg} className="form-icon" alt="" />
                    <div style={{ width: "100px" }}>End Date</div>
                    <DatePicker
                      id="formEndDate"
                      minDate={startDate}
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <img src={hourImg} className="form-icon" alt="" />
                    <div style={{ width: "100px" }}>Start Hour</div>
                    <DatePicker
                      id="formStartHour"
                      selected={startHour}
                      onChange={(date) => setStartHour(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center">
                    <img src={hourImg} className="form-icon" alt="" />
                    <div style={{ width: "100px" }}>End Hour</div>
                    <DatePicker
                      id="formEndHour"
                      minDate={startHour}
                      selected={endHour}
                      onChange={(date) => setEndHour(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                    />
                  </div>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Add Rule
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
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
