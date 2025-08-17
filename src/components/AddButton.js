import {cilPlus} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React from "react";
import TextButton from "./TextButton";

const AddButton = ({children, onClick}) => {
    return (
            <TextButton onClick={onClick}>
                <CIcon icon={cilPlus} size="custom"/>
                {children}
            </TextButton>

    );
};

export default AddButton;
