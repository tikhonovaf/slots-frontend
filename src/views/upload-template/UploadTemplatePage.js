import React, {memo, useState} from "react";
import {useNavigate} from "react-router";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";
import { Upload, Button, message, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadTemplatePage = memo(({activeTab}) => {

    const navigate = useNavigate();

    const [file, setFile] = useState(undefined);

    const props = {
        name: 'file',
        action: '/api/slots/template/upload',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                setFile(undefined);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                setFile(info.file);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <CContainer lg>
            <h4 className={"mb-4 mt-2"}>Загрузка файла с шаблоном расписания</h4>

            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Загрузить файл</Button>
                </Upload>

                {
                    file && (
                        <List
                            header={<div>Результат загрузки файла {file.name}</div>}
                            bordered
                            dataSource={file.response}
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

export default UploadTemplatePage;
