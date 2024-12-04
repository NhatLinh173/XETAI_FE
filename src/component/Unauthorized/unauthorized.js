import React from "react";
import { useHistory } from "react-router-dom";

const Unauthorized = () => {
  const history = useHistory();

  return <div className="unauthorized-container"></div>;
};

export default Unauthorized;
