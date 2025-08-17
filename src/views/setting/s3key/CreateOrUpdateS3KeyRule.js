import {CButton, CCol, CForm, CFormInput, CFormSelect, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useCreateSettingKey} from "../../../hooks/setting/s3key/useCreateSettingKey";
import {useUpdateSettingKey} from "../../../hooks/setting/s3key/useUpdateSettingKey";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import {useDepartments} from "../../../hooks/reference/department/useDepartments";


const CreateOrUpdateS3KeyRule = memo(({
                                          open,
                                          data,
                                          onClose
                                      }) => {

    const [newSetting, setNewSetting] = useState();

    const {data: clusters, state: clustersStatus} = useClusters();
    const [departments, departmentsStatus] = useDepartments()

    const createSetting = useCreateSettingKey();
    const updateSetting = useUpdateSettingKey();

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
                createSetting({
                    data: newSetting,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateSetting({
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

                <CCol className={"mb-3"}>
                    <CFormSelect
                        label={"Кластер"}
                        value={newSetting ? newSetting.clusterId : ""}
                        required
                        onChange={(e) => {
                            setNewSetting({
                                ...newSetting,
                                clusterId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {clusters && clusters.length > 0 && clusters?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>

                <CFormInput
                    className={"mb-3"}
                    label={"Бакет"}
                    // required
                    value={newSetting ? newSetting.bucket : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            bucket: e.target.value,
                        })
                    }
                />

                <CFormInput
                    className={"mb-3"}
                    label={"Secret Key"}
                    type={"password"}
                    disabled={data}
                    required
                    value={newSetting ? newSetting.secretKey : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            secretKey: e.target.value,
                        })
                    }
                />

                <CFormInput
                    className={"mb-3"}
                    label={"Ключ доступа"}
                    // type={"password"}
                    // disabled={data}
                    required
                    value={newSetting ? newSetting.accessKey : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            accessKey: e.target.value,
                        })
                    }
                />


                <CCol className={"mb-3"}>
                    <CFormSelect
                        label={"Отдел"}
                        value={newSetting ? newSetting.departmentId : ""}
                        required
                        onChange={(e) => {
                            setNewSetting({
                                ...newSetting,
                                departmentId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {departments && departments.length > 0 && departments?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateS3KeyRule;
