import "./styles.scss";
import React, { Fragment } from "react";
import Header from "./Header.js";
import Show from "./show.js";
import Empty from "./Empty.js";
import Status from "./Status.js";
import Confirm from "./Confirm";
import Form from "./Form.js";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const DELETE = "DELETE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function edit() {
    transition(EDIT);
  }

  function deleteInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(DELETE, true);

    debugger
    props
      .deleteInterview(props.id, interview)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  function onAdd() {
    transition(CREATE);
  }

  function onCancel() {
    back();
  }

  function onClose() {
    back();
    back();
  }

  function checkDelete() {
    transition(CONFIRM);
  }

  return (
    <Fragment>
      <Header time={props.time} />
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={onCancel}
          onSave={save}
        />
      )}

      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          selectedInterviewID={props.interview.interviewer.id}
          onSave={save}
          onCancel={onCancel}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you want to delete?"}
          onCancel={onCancel}
          onConfirm={deleteInterview}
        />
      )}

      {mode === EMPTY && <Empty onAdd={onAdd} />}

      {mode === DELETE && <Status message={"Deleting"} />}

      {mode === SAVING && <Status message={"Saving"} />}

      {mode === ERROR_SAVE && (
        <Error message={"Could not save appointment"} onClose={onClose} />
      )}
      {mode === ERROR_DELETE && (
        <Error message={"Could not delete appointment"} onClose={onClose} />
      )}

      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={checkDelete}
          onEdit={edit}
        />
      )}
    </Fragment>
  );
}
