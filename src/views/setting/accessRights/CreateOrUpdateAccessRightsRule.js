import {CButton, CForm, CFormInput, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useUpdateCluster} from "../../../hooks/reference/cluster/useUpdateCluster";
import {useCreateCluster} from "../../../hooks/reference/cluster/useCreateCluster";


const CreateOrUpdateAccessRightsRule = memo(({
                                                 open,
                                                 data,
                                                 onClose
                                             }) => {

    const [newSetting, setNewSetting] = useState();
    const createCluster = useCreateCluster();
    const updateCluster = useUpdateCluster();


    useEffect(() => {
        if (data) {
            setNewSetting(data)
        } else {
            setNewSetting(null);
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!data) {
                createCluster({
                    data: newSetting,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateCluster({
                    data: newSetting,
                    afterUpdate: () => {

                    }
                });
            }
            setNewSetting(null);
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
                    {!data ? 'Новое правило' : 'Изменить правило'}
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
                    value={newSetting ? newSetting.name : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            name: e.target.value,
                        })
                    }
                />
                <CFormInput
                    className={"mb-3"}
                    label={"Ссылка"}
                    required
                    value={newSetting ? newSetting.url : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            url: e.target.value,
                        })
                    }
                />
                {/*<CCol className={"mb-3"}>*/}
                {/*    <CFormSelect*/}
                {/*        label={"Вендор"}*/}
                {/*        value={newSetting ? newSetting.vendorId : ""}*/}
                {/*        required*/}
                {/*        onChange={(e) => {*/}
                {/*            setNewSetting({*/}
                {/*                ...newSetting,*/}
                {/*                vendorId:e.target.value,*/}
                {/*            })*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <option value={""} disabled selected hidden>*/}
                {/*           Выберите значение*/}
                {/*        </option>*/}
                {/*        {vendors && vendors.length > 0 && vendors?.map((el) => (*/}
                {/*            <option value={el?.id} key={el?.id}>*/}
                {/*                {el?.name}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </CFormSelect>*/}
                {/*</CCol>*/}

                <CFormTextarea
                    className={"mb-3"}
                    label={"Описание"}
                    // required
                    value={newSetting ? newSetting.comment : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            comment: e.target.value,
                        })
                    }
                />

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateAccessRightsRule;
