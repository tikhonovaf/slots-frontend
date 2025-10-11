import React, {memo, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {CContainer} from "@coreui/react";
import { Button, Form, List, Select, Space, DatePicker } from 'antd';
import dayjs from "dayjs";
import {useSendMAils} from "../../hooks/slot/useSentMails";
import {DATE_DISPLAY_FORMAT, DATE_FORMAT} from "../../constants";

import { useClientUsers } from "../../hooks/reference/client/useClientUsers";

const SendMailPage = memo(({activeTab}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [clients, clientsStatus] = useClientUsers();
    const { RangePicker } = DatePicker;
    const sendMails = useSendMAils();

    const [generateResponse, setGenerateResponse] = useState(undefined);
    const [generating, setGenerating] = useState(false);

    const clientsOptions = useMemo(() => clients ? clients.map(s => ({ value: s.nUserId, label: s.vcInfo })) : [], [clients]);

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const tailLayout = {
        wrapperCol: { offset: 4, span: 20 },
    };
    
    const onFinish = (values: any) => {
        const {nUserIds, period} = values;
        const [dDateBegin, dDateEnd] = period;
        
        // Очищаем ответы перед выполнением
        setGenerateResponse(undefined);
        setGenerating(true);

        // Выполняем запроса
        sendMails({
            data: {
                nUserIds,
                dDateBegin: dDateBegin?.format(DATE_FORMAT),
                dDateEnd: dDateEnd?.format(DATE_FORMAT)
            },
            afterSuccess: (data) => {
                // Если успешно, то заполняем ответы для отображения
                setGenerateResponse(data);
                setGenerating(false);
            },
            afterError: (err) => {
                // Снимаем режим выполнения
                setGenerating(false);
            }
        })
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <CContainer lg>
            <h4 className={"mb-4 mt-2"}>Отправка писем</h4>

            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    initialValues={{ period: [dayjs(), dayjs().add(1, 'day')] }}
                    >
                    <Form.Item
                        name="nUserIds"
                        label="Пользователи"
                        rules={[{ required: true, message: 'Нужно выбрать пользователя' }]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Нужно выбрать пользователя"
                            options={clientsOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        name="period"
                        label="Период"
                        rules={[{ required: true, message: 'Нужно выбрать период' }]}
                    >
                        <RangePicker format={DATE_DISPLAY_FORMAT} />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                        <Button type="primary" htmlType="submit" loading={generating}>
                            Отправить
                        </Button>
                        <Button htmlType="button" onClick={onReset} loading={generating}>
                            Сбросить
                        </Button>
                        </Space>
                    </Form.Item>
                </Form>

                {
                    generateResponse && (
                        <List
                            header={<div>Результат отправки писем</div>}
                            bordered
                            dataSource={generateResponse}
                            renderItem={(item) => (
                                <List.Item>
                                    {item}
                                </List.Item>
                            )}
                        />
                    )
                }
            </CContainer>
        </CContainer>
    );
})

export default SendMailPage;
