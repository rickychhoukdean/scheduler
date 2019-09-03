import React from "react";
import "components/DayListItem.scss";

const classNames = require("classnames");

const formatSpots = function(remaining) {
  if (remaining > 1) {
    return `${remaining} spots remaining`;
  } else if (remaining === 1) {
    return `${remaining} spot remaining`;
  } else return `no spots remaining`;
};

export default function DayListItem(props) {
  
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2>{props.name}</h2>
      <h3>{formatSpots(props.spots)}</h3>
    </li>
  );
}
