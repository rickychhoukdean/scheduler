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
      if (action.interview) {
        const appointment = {
          ...state.appointments[action.id],
          interview: { ...action.interview }
        };

        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        return { ...state,  appointments };
      } else {
        const appointment = {
          ...state.appointments[action.id],
          interview: null
        };

        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        return { ...state, appointments };
      }

    case "UPDATE_SPOTS":
      return { ...state, days: action.value };

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

  function dayChanger(id, operation) {
    let num = 1;
    if (operation === "subtract") {
      num = -1;
    }

    let newDays = state.days.map(day => {
      const correctDay = day.appointments.filter(day => day === id);
      if (correctDay.length > 0) {
        return { ...day, spots: day.spots + num };
      } else return day;
    });
    dispatch({ type: "UPDATE_SPOTS", value: newDays });
  }

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

    const webSocket = new WebSocket("ws://localhost:8001");

    webSocket.onopen = function() {
      webSocket.send(`Socket initialized`);
    };

    webSocket.onmessage = function(message) {
      let parsedMessage = JSON.parse(message.data);
      if (parsedMessage.type === "SET_INTERVIEW") {
        dispatch({ ...parsedMessage });
      }
    };
  },[]);

  function bookInterview(id, interview) {
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, {
        interview
      })
      .then(dayChanger(id, "subtract"))
      .then(dispatch({ type: "SET_INTERVIEW", interview, id }))
  }

  function deleteInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(dayChanger(id, "add"))  
      .then(dispatch({ type: "SET_INTERVIEW", id }))
  }

  return { state, setDay, bookInterview, deleteInterview };
}
