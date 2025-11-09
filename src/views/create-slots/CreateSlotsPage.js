import React, {memo, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {CContainer} from "@coreui/react";
import { Button, Form, List, Select, Space, DatePicker } from 'antd';
import dayjs from "dayjs";
import {useGenerateSlots} from "../../hooks/slot/useGenerateSlots";
import {DATE_DISPLAY_FORMAT, DATE_FORMAT} from "../../constants";

import {useTemplates} from "../../hooks/reference/template/useTemplates";

const CreateSlotsPage = memo(({activeTab}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [templates, templatesStatus] = useTemplates();
    const { RangePicker } = DatePicker;
    const generateSlots = useGenerateSlots();

    const [generateResponse, setGenerateResponse] = useState(undefined);
    const [generating, setGenerating] = useState(false);

    const templateOptions = useMemo(() => templates ? templates.map(s => ({ value: s.nSlotTemplateId, label: s.vcName })) : [], [templates]);

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const tailLayout = {
        wrapperCol: { offset: 4, span: 20 },
    };
    
    const handleFinish = (values: any) => {
        const {nSlotTemplateId, period} = values;
        const [dDateBegin, dDateEnd] = period;

        // Очищаем ответы перед выполнением
        setGenerateResponse(undefined);
        setGenerating(true);

        // Выполняем запроса
        generateSlots({
            data: {
                nSlotTemplateId,
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
            <h4 className={"mb-4 mt-2"}>Формирование слотов на основе шаблона</h4>

            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                <Form
                    {...layout}
                    form={form}
                    name="control-hooks"
                    onFinish={handleFinish}
                    initialValues={{ period: [dayjs(), dayjs().add(1, 'day')] }}
                    >
                    <Form.Item
                        name="nSlotTemplateId"
                        label="Шаблон"
                        rules={[{ required: true, message: 'Нужно выбрать шаблон' }]}
                    >
                        <Select
                            // mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Нужно выбрать шаблон"
                            options={templateOptions}
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
                            Сформировать
                        </Button>
                        <Button htmlType="button" onClick={onReset} loading={generating}>
                            Сбросить настройки
                        </Button>
                        </Space>
                    </Form.Item>
                </Form>

                {
                    generateResponse && (
                        <List
                            header={<div>Результат формирования слотов</div>}
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

export default CreateSlotsPage;
