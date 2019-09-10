import React from "react";
import ReactDOM from "react-dom";

import "index.scss";

import Application from "components/Application";
import { act } from "react-test-renderer";

act(() => {
  ReactDOM.render(<Application />, document.getElementById("root"));
});
