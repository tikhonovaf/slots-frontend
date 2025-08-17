import {CButton, CForm, CFormInput, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useUpdateRole} from "../../../hooks/reference/role/useUpdateRole";
import {useCreateRole} from "../../../hooks/reference/role/useCreateRole";


const CreateOrUpdateRole = memo(({
                                       open,
                                       data,
                                       onClose
                                   }) => {

    const [newRole, setNewRole] = useState();
    const createRole = useCreateRole();
    const updateRole = useUpdateRole();


    useEffect(() => {
        if (data) {
            setNewRole(data)
        } else {
            setNewRole(null);
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!data) {
                createRole({
                    data: newRole,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateRole({
                    data: newRole,
                    afterUpdate: () => {

                    }
                });
            }
            setNewRole(null);
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
                    {!data ? 'Новая роль' : 'Изменить роль'}
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
                    label={"Название"}
                    required
                    value={newRole ? newRole.name : ""}
                    onChange={(e) =>
                        setNewRole({
                            ...newRole,
                            name: e.target.value,
                        })
                    }
                />


                <CFormTextarea
                    className={"mb-3"}
                    label={"Описание"}
                    value={newRole ? newRole.description : ""}
                    onChange={(e) =>
                        setNewRole({
                            ...newRole,
                            description: e.target.value,
                        })
                    }
                />

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateRole ;
