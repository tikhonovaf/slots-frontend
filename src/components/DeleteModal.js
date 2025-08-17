import {CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,} from "@coreui/react";
import React, {useState} from "react";

export const DeleteModal = ({visible, title, text, name, onClose, onSubmit}) => {
    const [submitting, setSubmitting] = useState(false);

    const onSubmitInternal = async () => {
        setSubmitting(true);
        try {
            await onSubmit?.();
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <CModal
            visible={visible}
            alignment={"center"}
            unmountOnClose={true}
            onClick={(e) => e.stopPropagation()}
        >
            <CModalHeader>
                <CModalTitle>{title}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <p className={"mt-3"}>{text} <bold>{name}</bold></p>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color={"primary"}
                    className={"modal-button"}
                    onClick={onSubmitInternal}
                    disabled={submitting}
                >
                    Удалить
                </CButton>
                <CButton
                    color={"primary-rgb"}
                    className={"new-migration-btn modal-button"}
                    onClick={onClose}
                >
                    Закрыть
                </CButton>
            </CModalFooter>
        </CModal>
    );
};
