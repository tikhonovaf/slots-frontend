import {CButton, CForm, CFormInput, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useUpdateRecordType} from "../../../hooks/reference/recordType/useUpdateRecordType";
import {useCreateRecordType} from "../../../hooks/reference/recordType/useCreateRecordType";

const CreateOrUpdateMethod = memo(({
                                       open,
                                       data,
                                       onClose
                                   }) => {

    const [newRecordType, setNewRecordType] = useState();
    const createRecordType = useCreateRecordType();
    const updateRecordType = useUpdateRecordType();


    useEffect(() => {
        if (data) {
            setNewRecordType(data)
        } else {
            setNewRecordType(null);
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!data) {
                createRecordType({
                    data: newRecordType,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateRecordType({
                    data: newRecordType,
                    afterUpdate: () => {

                    }
                });
            }
            setNewRecordType(null);
            setValidated(false);
            onClose();
        }
    )


    return (
        <Drawer
            placement={"right"}
            open={open}
            width={500}
            closable={false}
            bodyStyle={{paddingBottom: 20, paddingTop: 100}}
        >
            <CForm validated={validated}
                   onSubmit={handleSubmit}
                   noValidate>
                <h6 style={{margin: '-8px 0px 0px 0px'}}>
                    {!data ? 'Новый S3 метод' : 'Изменить S3 метод'}
                </h6>
                <div style={{float: "right", margin: "-28px 0px 0px 0px"}}>
                    <CTooltip content={"Закрыть"}
                    >
                        <Button
                            style={{float: 'right', width: '31px', height: '31px', margin: '0px 0px 0px 10px'}}
                            icon={<CloseOutlined/>}
                            onClick={() => onClose()}
                        />
                    </CTooltip>

                    <CButton color={"primary"}
                             size={"sm"}
                             type={"submit"}
                             style={{display: 'inline-block'}}
                             disabled={newRecordType?.id < 100}
                    >
                        Сохранить
                    </CButton>

                </div>
                <hr style={{margin: "15px 0px 15px 0px"}}/>

                <CFormInput
                    className={"mb-3"}
                    label={"Имя"}
                    required
                    disabled={newRecordType?.id < 100}
                    value={newRecordType ? newRecordType.name : ""}
                    onChange={(e) =>
                        setNewRecordType({
                            ...newRecordType,
                            name: e.target.value,
                        })
                    }
                />

                <CFormTextarea
                    className={"mb-3"}
                    label={"Описание"}
                    disabled={newRecordType?.id < 100}
                    value={newRecordType ? newRecordType.description : ""}
                    onChange={(e) =>
                        setNewRecordType({
                            ...newRecordType,
                            description: e.target.value,
                        })
                    }
                />

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateMethod;
