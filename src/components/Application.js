import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "../components/DayList";
import "components/Application.scss";
import Appointment from "../components/Appointment";

const appointments = [
  {
    id: 1,
    time: "12pm"
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      }
    }
  },
  { id: 3, time: "2pm" }
];

// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0
//   }
// ];

export default function Application(props) {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]);

  useEffect(() => {
    axios.get(`/api/days`).then(res => setDays(res.data));
  }, []);

  const appointmentComponent = appointments.map(appointment => {
    return <Appointment key={appointment.id} {...appointment} />;
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} day={day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />{" "}
      </section>
      <section className="schedule">{appointmentComponent}</section>
    </main>
  );
}
