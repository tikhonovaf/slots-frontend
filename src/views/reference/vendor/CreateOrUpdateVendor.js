import {CButton, CForm, CFormInput, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useCreateVendor} from "../../../hooks/reference/vendor/useCreateVendor";
import {useUpdateVendor} from "../../../hooks/reference/vendor/useUpdateVendor";

const CreateOrUpdateVendor = memo(({
                                             open,
                                             data,
                                             onClose
                                         }) => {

    const [newVendor, setNewVendor] = useState();
    const createVendor = useCreateVendor();
    const updateVendor = useUpdateVendor();


    useEffect(() => {
        if (data) {
            setNewVendor(data)
        } else {
            setNewVendor(null);
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!data) {
                createVendor({
                    data: newVendor,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateVendor({
                    data: newVendor,
                    afterUpdate: () => {

                    }
                });
            }
            setNewVendor(null);
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
                    {!data ? 'Новый вендор' : 'Изменить вендора'}
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
                    value={newVendor ? newVendor.name : ""}
                    onChange={(e) =>
                        setNewVendor({
                            ...newVendor,
                            name: e.target.value,
                        })
                    }
                />

                <CFormTextarea
                    className={"mb-3"}
                    label={"Описание"}
                    // required
                    value={newVendor ? newVendor.description : ""}
                    onChange={(e) =>
                        setNewVendor({
                            ...newVendor,
                            description: e.target.value,
                        })
                    }
                />

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateVendor ;
