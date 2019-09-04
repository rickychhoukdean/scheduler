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

// useVisualMode();

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function onAdd() {
    transition(CREATE);
    // return `<Form/>`;
  }

  function onCancel() {
    back();
  }

  return (
    <Fragment>
      <Header time={props.time} />
      {mode === CREATE && <Form interviewers={[]} onCancel={onCancel} />}
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
    </Fragment>
  );
}
