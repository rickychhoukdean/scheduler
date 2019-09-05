import React, { Fragment } from "react";
import "./styles.scss";
import Header from "./Header.js";
import Show from "./show.js";
import Empty from "./Empty.js";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form.js";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  function deleteInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.deleteInterview(props.id, interview);

    transition(EMPTY);
  }

  function onAdd() {
    transition(CREATE);
  }

  function onCancel() {
    back();
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
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={deleteInterview}
        />
      )}
    </Fragment>
  );
}
