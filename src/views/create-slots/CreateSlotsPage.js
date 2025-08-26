import React, {memo, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";
import { Button, Form, Input, Select, Space, DatePicker } from 'antd';
import dayjs from "dayjs";

import {useStores} from "../../hooks/reference/store/useStores";

const CreateSlotsPage = memo(({activeTab}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [stores, storesStatus] = useStores();
    const { RangePicker } = DatePicker;

    const storeOptions = useMemo(() => stores ? stores.map(s => ({ value: s.nStoreId, label: s.vcName })) : [], [stores]);

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const tailLayout = {
        wrapperCol: { offset: 4, span: 20 },
    };
    
    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <CContainer lg>
            <h4 className={"mb-4 mt-2"}>Формирование слотов на основе шаблона</h4>

            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    initialValues={{ period: [dayjs(), dayjs().add(1, 'day')] }}
                    >
                    <Form.Item name="nStoreIds" label="Нефтебазы" rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Нужно выбрать нефтебазу"
                            options={storeOptions}
                        />
                    </Form.Item>

                    <Form.Item name="period" label="Период" rules={[{ required: true }]}>
                        <RangePicker />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                        <Button type="primary" htmlType="submit">
                            Сформировать
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Сбросить настройки
                        </Button>
                        </Space>
                    </Form.Item>
                    </Form>

            </CContainer>
        </CContainer>
    );
})

export default CreateSlotsPage;
