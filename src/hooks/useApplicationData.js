import { useEffect, useReducer } from "react";
import axios from "axios";

function reducer(state, action) {
  switch (action.type) {
    case "SET_DAY":
      return { ...state, day: action.value };

    case "SET_APPLICATION_DATA":
      return {
        ...state,
        days: action.values.days,
        appointments: action.values.appointments,
        interviewers: action.values.interviewers
      };
    case "SET_INTERVIEW":
      return;
    case "BOOK_INTERVIEW":
      return { ...state, appointments: action.value };
    case "DELETE_INTERVIEW":
      return;

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: "SET_DAY", value: day });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days/`),
      axios.get(`http://localhost:8001/api/appointments/`),
      axios.get(`http://localhost:8001/api/interviewers/`)
    ]).then(all => {
      dispatch({
        type: "SET_APPLICATION_DATA",
        values: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }
      });
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
      .then(dispatch({ type: "BOOK_INTERVIEW", value: appointments }));
  }

  function deleteInterview(id) {
    return axios.delete(`/api/appointments/${id}`);
  }

  return { state, setDay, bookInterview, deleteInterview };
}
