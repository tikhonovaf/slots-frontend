
import { CLink } from "@coreui/react";
import React from "react";

const TextButton = ({ children, onClick }) => {
  return (
    <CLink className={"text-decoration-none cursor-pointer"} onClick={onClick}>
      {children}
    </CLink>
  );
};

export default TextButton;
