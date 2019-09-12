import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS
} from "reducers/application";


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
      axios.get("/api/days/"),
      axios.get("/api/appointments/"),
      axios.get("/api/interviewers/")
    ])
      .then(url => {
        dispatch({
          type: "SET_APPLICATION_DATA",

          days: url[0].data,
          appointments: url[1].data,
          interviewers: url[2].data
        });
      })
      .catch(err => err);

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
  }, []);

  function bookInterview(id, interview) {
    if (state.appointments[id].interview === null) {
      return axios
        .put(`/api/appointments/${id}`, {
          interview
        })
        .then(() => {
          dispatch({ type: "SET_INTERVIEW", interview, id });
        })
        .then(() => {
          dayChanger(id, "subtract");
        });
    } else {
      return axios
        .put(`/api/appointments/${id}`, {
          interview
        })
        .then(() => {
          dispatch({ type: "SET_INTERVIEW", interview, id });
        });
    }
  }

  function deleteInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: "SET_INTERVIEW", id });
      })
      .then(() => {
        dayChanger(id, "add");
      });
  }

  return { state, setDay, bookInterview, deleteInterview };
}
