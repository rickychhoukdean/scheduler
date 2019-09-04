import React, { useState, Fragment } from "react";

import "./styles.scss";
import Button from "../Button.js";
import InterviewerList from "../InterviewerList.js";
// import Header from "./Header.js";
// import Show from "./Show.js";
// import Empty from "./Empty.js"
export default function Form(props) {
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);

  function reset() {
    setName("");
    setInterviewer(null);
  }

  function cancel() {
    reset();
    props.onCancel();
  }

  function save() {
    props.onSave(name, interviewer);
  }

  function nameStateChange(event) {
    setName(event.target.value);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            onChange={nameStateChange} //change this into a inline function
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder={name}
            /*
          This must be a controlled component
        */
          />
        </form>
        <InterviewerList
          interviewers={[props.interviewers]}
          selectedInterviewID={interviewer}
          setInterviewer={setInterviewer}
          interviewer={interviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={save}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
