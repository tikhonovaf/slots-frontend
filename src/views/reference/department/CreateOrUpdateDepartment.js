import {CButton, CForm, CFormInput, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useCreateDepartment} from "../../../hooks/reference/department/useCreateDepartment";
import {useUpdateDepartment} from "../../../hooks/reference/department/useUpdateDepartment";

const CreateOrUpdateDepartment = memo(({
                                       open,
                                       data,
                                       onClose
                                   }) => {

    const [newDepartment, setNewDepartment] = useState();
    const createDepartment = useCreateDepartment();
    const updateDepartment = useUpdateDepartment();


    useEffect(() => {
        if (data) {
            setNewDepartment(data)
        } else {
            setNewDepartment(null);
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!data) {
                createDepartment({
                    data: newDepartment,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateDepartment({
                    data: newDepartment,
                    afterUpdate: () => {

                    }
                });
            }
            setNewDepartment(null);
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
                    {!data ? 'Новый отдел' : 'Изменить отдел'}
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
                    >
                        Сохранить
                    </CButton>

                </div>
                <hr style={{margin: "15px 0px 15px 0px"}}/>

                <CFormInput
                    className={"mb-3"}
                    label={"Имя"}
                    required
                    value={newDepartment ? newDepartment.name : ""}
                    onChange={(e) =>
                        setNewDepartment({
                            ...newDepartment,
                            name: e.target.value,
                        })
                    }
                />


                <CFormTextarea
                    className={"mb-3"}
                    label={"Описание"}
                    // required
                    value={newDepartment ? newDepartment.description : ""}
                    onChange={(e) =>
                        setNewDepartment({
                            ...newDepartment,
                            description: e.target.value,
                        })
                    }
                />

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateDepartment ;
