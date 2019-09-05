import React, { useState } from "react";

import "./styles.scss";
import Button from "../Button.js";
import InterviewerList from "../InterviewerList.js";

export default function Form(props) {
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.selectedInterviewID || null);

  function reset() {
    setName("");
    setInterviewer(null);
  }

  function cancel() {
    reset();
    props.onCancel();
  }

  function onSave() {
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
            onChange={nameStateChange}
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
          interviewers={props.interviewers}
          setInterviewer={setInterviewer}
          selectedInterviewID={interviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={onSave}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
