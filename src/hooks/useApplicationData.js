import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors";


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days/`),
      axios.get(`http://localhost:8001/api/appointments/`),
      axios.get(`http://localhost:8001/api/interviewers/`)
    ]).then(all => {
      setState(prev => ({
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(setState({ ...state, appointments }));
  }

  function deleteInterview(id, interview) {
    return axios.delete(`/api/appointments/${id}`);
  }

  return {state, setDay, bookInterview, deleteInterview };
}
