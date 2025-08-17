import { CFormLabel } from "@coreui/react";
import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash, cilVerticalAlignBottom } from "@coreui/icons";
import cn from "classnames";
import { cilAttach } from "../assets/brand/cilAttach";

const FileField = ({
  id,
  name,
  label,
  className,
  onChange,
  href,
  onEdit,
  onDelete,
  disabled
}) => {
  const [drag, setDrag] = useState(false);

  const labelElement = label && (
    <CFormLabel className={"form-label"}>{label}</CFormLabel>
  );
  if (id) {
    return (
      <div className={className}>
        {labelElement}
        <div className={"file-field-uploaded d-flex justify-content-between"}>
          <CFormLabel className={"form-label no-margin ellipsis"}>{name !== null ? name : " \u00A0"}</CFormLabel>
          {!disabled && <div>
            {onEdit && (
                <CIcon icon={cilPen} className={"me-3 cursor-pointer"}/>
            )}
            {href && (
                <>
                  <a
                      download
                      href={href}
                  >
                    <CIcon
                        icon={cilVerticalAlignBottom}
                        className={"me-3 cursor-pointer text-black"}
                    />
                  </a>
                </>
            )}
            <CIcon
                icon={cilTrash}
                className={"me-3 cursor-pointer"}
                onClick={onDelete}
            />
            <label>
              <CIcon icon={cilAttach} className={"cursor-pointer"}/>
              <input
                  className={"visually-hidden"}
                  type={"file"}
                  onChange={(event) => onChange?.(event.target.files)}
              />
            </label>
          </div>}
        </div>
      </div>
    );
  } else {
    return (
      <div className={className}>
        {labelElement}
        {!disabled ? (<div className={"d-flex align-items-center"}>
          <label
              className={cn(
                  "label-file-upload",
                  drag && "label-file-upload-drop",
              )}
              onDragLeave={(e) => {
                e.preventDefault();

                setDrag(false);
              }}
              onDragStart={(e) => {
                e.preventDefault();

                setDrag(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();

                setDrag(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onChange(e.dataTransfer.files);
              }}
          >
            <input
                className={"visually-hidden"}
                type={"file"}
                onChange={(event) => onChange && onChange(event.target.files)}
                disabled={disabled}
            />
            <div className={"d-flex align-items-center"}>
              <div className={"upload-button me-1"}>Загрузите</div>
              <div className={"upload-button-text"}>
                или перетащите в эту область
              </div>
            </div>
          </label>
        </div>) : (
            <div className={"d-flex align-items-center"} style={{background: disabled?'rgba(239, 239, 239, 0.3)':'#fff'}}>
              <label
                  className={cn(
                      "label-file-upload",
                      drag && "label-file-upload-drop",
                  )}
              >
                <input
                    className={"visually-hidden"}
                    type={"file"}
                    onChange={(event) => onChange && onChange(event.target.files)}
                    disabled={disabled}
                />
                <div className={"d-flex align-items-center"} >
                  <div className={"upload-button me-1"}>Нет файлов</div>
                   <div className={"upload-button-text"}> 
                     или перетащите в эту область 
                   </div> 
                </div>
              </label>
            </div>
        )}
      </div>
    );
  }
};

export default FileField;
