import React from "react";
import "./styles.scss";
import Button from "../Button.js";

export default function Confirm(props) {
  return (
    <main className="appointment__card appointment__card--confirm">
      <h1 className="text--semi-bold">{props.message}</h1>
      <section className="appointment__actions">
        <Button alt="Cancel" danger onClick={props.onCancel} >
          Cancel
        </Button>
        <Button alt="Confirm" danger onClick={props.onConfirm} >
          Confirm
        </Button>
      </section>
    </main>
  );
}
