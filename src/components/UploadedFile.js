import React from "react";
import {CFormInput, CFormLabel} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilTrash, cilVerticalAlignBottom} from "@coreui/icons";
import {cilAttach} from "../assets/brand/cilAttach";

const UploadedFile = ({
                          children,
                          className,
                          onClick,
                          onUpload,
                          onDownload,
                          href,
                          disabled,
                          ...rest
                      }) => {
    return (
        <div className={"d-flex align-items-center"} {...rest}>
            <div style={{background: disabled ? '#d9d9d963' : '#fff'}}
                 className={`migration-file-uploader`}
            >
                <CFormLabel style={{color:'black'}} className={"form-label no-margin ellipsis "}>{children}</CFormLabel>
                <div style={{float: 'right', margin: '0px 0px 0px 5px '}}>
                    <a
                        download
                        href={href}
                    >
                        <CIcon
                            icon={cilVerticalAlignBottom}
                            className={"me-3 cursor-pointer text-black"}
                        />
                    </a>
                    {!disabled && <CIcon
                        icon={cilTrash}
                        className={"me-3 cursor-pointer"}
                        onClick={(event) => onClick && onClick(event)}
                    />}
                     <label> 
                       <CIcon icon={cilAttach} className={"cursor-pointer"}/> 
                       <CFormInput 
                           className={"visually-hidden"} 
                           type={"file"} 
                           onChange={(event) => onUpload?.(event)} 
                       /> 
                     </label> 
                </div>
            </div>
        </div>
    );
};

export default UploadedFile;
