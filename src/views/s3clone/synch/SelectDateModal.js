import {CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,} from "@coreui/react";
import React, {useRef, useState} from "react";
import {ConfigProvider, DatePicker, message} from "antd";

export const SelectDateModal = ({visible, title, text, name, onClose, onSubmit}) => {
    const [submitting, setSubmitting] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [startDate, setStartDate] = useState();
    const searchInput = useRef(null);


    const clearFilters = () => {
        setFilteredInfo({});
        // setSearchText("");
    };

    const onSubmitInternal = async () => {
        if (!startDate || startDate === "") {
            message.error("Укпжите начало запуска сессии");
            return
        }
        setSubmitting(true);
        try {
            await onSubmit(startDate)?.();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CModal
            visible={visible}
            alignment={"center"}
            unmountOnClose={true}
            size={"lg"}
            onClick={(e) => e.stopPropagation()}
        >
            <CModalHeader>
                <CModalTitle style={{fontSize: '17px'}}>
                    <bold>{title}</bold>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div style={{fontColor: 'silver', fontSize: '15px', margin: '5px 0 20px 0'}}>{text}</div>
                <CCol className={"mb-3"}>
                    {/*<CFormLabel>*/}
                    {/*    Последнее изменение записи*/}
                    {/*</CFormLabel>*/}
                    <ConfigProvider locale={"ru"}>

                        <DatePicker
                            showTime
                            value={startDate}
                            onChange={(value, dateString) => {
                                setStartDate(value);
                                console.log('Selected Time: ', value);
                                console.log('Formatted Selected Time: ', dateString);
                            }}
                            // onOk={onOk}
                        />
                    </ConfigProvider>
                </CCol>

            </CModalBody>
            <CModalFooter>
                <CButton
                    color={"primary"}
                    className={"modal-button"}
                    onClick={onSubmitInternal}
                    disabled={submitting}
                >
                    Сохранить
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
