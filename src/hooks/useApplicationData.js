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
    if (operation === "subtract") { num = -1; }

   let newDays =  state.days.map(day => {
      const correctDay = day.appointments.filter(day => day === id);
      if (correctDay.length > 0) {
        return { ...day, spots: day.spots + num };
      } 
      else return day;
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

    dayChanger(id, "subtract");

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(dispatch({ type: "BOOK_INTERVIEW", value: appointments }));
  }

  function deleteInterview(id) {
    console.log(id);
    dayChanger(id, "add");
    return axios.delete(`/api/appointments/${id}`);
  }
  return { state, setDay, bookInterview, deleteInterview };
}
