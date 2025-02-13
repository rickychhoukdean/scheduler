import React from "react";
import DayListItem from "./DayListItem.js";

export default function DayList(props) {
  const dayListItems = props.days.map(day => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={props.setDay}
      />
    );
  });

  return <ul>{dayListItems}</ul>;
}
