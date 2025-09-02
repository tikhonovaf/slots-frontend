import {CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useCallback, useEffect, useState, useMemo} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import { Button, Form, Drawer, List, Select, Space, DatePicker } from 'antd';
import {CloseOutlined} from "@ant-design/icons";
import {useVendors} from "../../../hooks/reference/vendor/useVendors";
import {useUpdateCluster} from "../../../hooks/reference/cluster/useUpdateCluster";
import {useCreateCluster} from "../../../hooks/reference/cluster/useCreateCluster";
import {useUsers} from "../../../hooks/reference/user/useUsers";
import {ServerUrlsTable} from "../../../components/ServerUrlsTable";

import {useClusterCheckAccessability} from "../../../hooks/reference/cluster/useClusterCheckAccessability";
import {useNavigate} from "react-router";
import {useChangeSlotStatus} from "../../../hooks/slot/useChangeSlotStatus";


const ChangeSlotStatusDialog = memo(({open,data,clients,selectedSlots,changeSlotStatusType,onClose}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [newCluster, setNewCluster] = useState();
    const createCluster = useCreateCluster();
    const updateCluster = useUpdateCluster();
    const [vendors, vendorsStatus] = useVendors();
    const [users, usersStatus] = useUsers();
    const [isRegExp, setIsRegExp] = useState(true)
    const clientOptions = useMemo(() => clients ? clients.map(s => ({ value: s.nClientId, label: s.vcName })) : [], [clients]);
    const [generateResponse, setGenerateResponse] = useState(undefined);
    const [generating, setGenerating] = useState(false);
    const reserveSlots = useChangeSlotStatus("reserve");

    const {
        data: accessInfo,
        status: accessInfoStatus,
        refetch: refetchAccessStatus
    } = useClusterCheckAccessability(newCluster?.id)

    const handleClose = useCallback((data
    ) => {
        onClose()
    }, [])

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const tailLayout = {
        wrapperCol: { offset: 4, span: 20 },
    };
    
    const handleFinish = (values: any) => {
        const {nClientId} = values;

        // Очищаем ответы перед выполнением
        setGenerateResponse(undefined);
        setGenerating(true);

        // Выполняем запроса
        reserveSlots({
            data: selectedSlots.map(nSlotId => ({nSlotId, nClientId})),
            afterSuccess: (data) => {
                // Если успешно, то заполняем ответы для отображения
                setGenerateResponse(data);
                setGenerating(false);
                onClose(true)
            },
            afterError: (err) => {
                // Снимаем режим выполнения
                setGenerating(false);
            }
        })
    };

    return (
        <Drawer
            placement={"right"}
            open={open}
            width={560}
            closable={false}
            bodyStyle={{paddingBottom: 20, paddingTop: 100}}
        >
                <h6 style={{margin: '-8px 0px 30px 0px'}}>
                    {`${changeSlotStatusType==='free' ? "Снятие слотов с резерва" : "Резервирование слотов"}`}
                </h6>

                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={handleFinish}
                    initialValues={{}}
                    >
                    <Form.Item name="nClientId" label="Клиент" rules={[{ required: true }]}>
                        <Select
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Нужно выбрать клиента"
                            options={clientOptions}
                        />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                        <Button type="primary" htmlType="submit" loading={generating}>
                            {`${changeSlotStatusType==='free' ? "Снять" : "Зарезервировать"}`}
                        </Button>
                        <Button htmlType="button" onClick={handleClose} loading={generating}>
                            Отмена
                        </Button>
                        </Space>
                    </Form.Item>
                </Form>

        </Drawer>
    );
})


export default ChangeSlotStatusDialog;
