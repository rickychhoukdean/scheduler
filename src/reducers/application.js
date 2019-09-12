export default function reducer(state, action) {
  switch (action.type) {
    case "SET_DAY":
      return { ...state, day: action.value };

    case "SET_APPLICATION_DATA":
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
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
        return { ...state, appointments };
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
