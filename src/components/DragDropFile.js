import React, {useState} from "react";
import cn from "classnames";
import {CFormInput} from "@coreui/react";


const DragDropFile = ({
                          children,
                          className,
                          onChange,
                          isError,
                          onDrop,
                          template,
                          disabled,
                          ...rest
                      }) => {
    const [drag, setDrag] = useState(false);

    return (
        <div className={cn(className, "d-flex align-items-center")}>
            {!disabled ? (
                <label
                    className={cn("label-file-upload",
                        drag && "label-file-upload-drop",
                    )} style={{border: `${isError ? '1px solid red' : ''}`}}
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
                        onDrop(e);
                    }}
                >
                    <input
                        className={"visually-hidden"}
                        type={"file"}
                        onChange={(event) => onChange && onChange(event)}
                    />
                    <div className={"d-flex align-items-center"}>
                        <div className={"upload-button me-1"}>Загрузите</div>
                        <div className={"upload-button-text"}>
                            или перенесите файл
                        </div>
                    </div>
                </label>) : (
                <label
                    className={cn("label-file-upload",
                        drag && "label-file-upload-drop",
                    )}
                    style={{background: '#d9d9d963'}}
                >
                    <CFormInput
                        className={"visually-hidden"}
                        type={"file"}
                        accept={".csv, .txt"}
                        onChange={(event) => onChange && onChange(event)}
                        disabled
                    />
                    <div className={"d-flex align-items-center"}>
                        <div className={"upload-button me-1"}>Загрузите</div>
                        <div className={"upload-button-text"}>
                            или перенесите файл
                        </div>
                    </div>
                </label>
            )}
        </div>
    );
};

export default DragDropFile;
