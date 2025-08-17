import React from "react";
import cn from "classnames";

const ReadOnlyField = ({ value, className }) => {
  return <div className={cn("read-only-field", className)}>{value}</div>;
};

export default ReadOnlyField;
