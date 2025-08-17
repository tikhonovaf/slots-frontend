import React from "react";

const ModalCloseButton = ({ onClick }) => {
  return (
    <button className={"btn-close modal-close-button"} onClick={onClick} />
  );
};

export default ModalCloseButton;
