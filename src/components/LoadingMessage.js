import {CSpinner, CToast, CToastBody} from "@coreui/react";
import React from "react";

export const LoadingMessage = ({text}) => {

    return <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <CToast animation={false}
                autohide={false}
                visible={true}
                className={'styled-toast'}
        >
            <CToastBody><CSpinner color="light"/>
                <div className={'spinner-text'}> {text}</div>
            </CToastBody>
        </CToast></div>
}