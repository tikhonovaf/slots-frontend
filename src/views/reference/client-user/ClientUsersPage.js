import CIcon from "@coreui/icons-react";
import {Button, Input, message, Space, Spin, Table, TableProps, Tooltip, Alert} from "antd";
import {CContainer} from "@coreui/react";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import {useClientUsers} from "../../../hooks/reference/client-user/useClientUsers";

import {cilBrushAlt, cilLink, cilPlus, cilTrash} from "@coreui/icons";

export const ClientUsersPage = ({ nClientId }) => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [vendorFilter, setVendorFilter] = useState([]);

    const [clientUsers, clientUsersStatus] = useClientUsers(nClientId?nClientId:0);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => (<div
            style={{
                padding: 15,
            }}
        >
            <Input
                ref={searchInput}
                value={selectedKeys[0]}
                onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                }}
                style={{
                    marginBottom: 8, display: 'block', width: 250,
                }}
            />
            <Space>
                <Button
                    onClick={clearFilters}
                    size="small"
                >
                    Очистить
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined/>}
                >
                    Поиск
                </Button>
            </Space>
        </div>), filterIcon: (filtered) => (<SearchOutlined
            style={{
                color: filtered ? '#1677ff' : undefined,
            }}
        />), onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    const clearFilters = () => {
        setFilteredInfo({});
        setSearchText("");
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const tableLocale: TableLocale = {
        filterReset: <span
            onClick={clearFilters}>{'Очистить'}</span>, // emptyText: <div style={{backgroundImage:cilMenu}}>Нет данных</div>,
    }

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo(filters);
        console.log('filters', filters);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        ...nClientId
            ? [        ]
            : [
                {
                    title: 'Клиент',
                    dataIndex: 'vcClientCode',
                    key: 'vcClientCode', ...getColumnSearchProps('vcClientCode'),
                    sortDirections: ['ascend', 'descend', 'ascend'],
                    ellipsis: true, // width: '30%'
                },
            ],
        {
            title: 'Логин',
            dataIndex: 'vcLogin',
            key: 'vcLogin', ...getColumnSearchProps('vcLogin'),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
        {
            title: 'Фамилия',
            dataIndex: 'vcLastName',
            key: 'vcLastName', ...getColumnSearchProps('vcLastName'),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
        {
            title: 'Имя',
            dataIndex: 'vcFirstName',
            key: 'vcFirstName', ...getColumnSearchProps('vcFirstName'),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
        {
            title: 'Отчество',
            dataIndex: 'vcSecondName',
            key: 'vcSecondName', ...getColumnSearchProps('vcSecondName'),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
        {
            title: 'E-mail',
            dataIndex: 'vcEmail',
            key: 'vcEmail', ...getColumnSearchProps('vcEmail'),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
        {
            title: 'Телефон',
            dataIndex: 'vcPhone',
            key: 'vcPhone', ...getColumnSearchProps('vcPhone'),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
    ];

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
        setSelectedIds(selectedRowKeys)
    }

    const rowSelection = {
        type: 'radio',
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
                setSelectedIds([]);
            }
        }, onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)
        },
    };

    return <>
        <h5 style={{
            margin: '0 0 30px 0', float: 'left'
        }}>Пользователи</h5>

        <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>
            <Table
                loading={clientUsersStatus === "loading"}
                columns={columns}
                dataSource={clientUsers}
                onChange={handleTableChange}
                size={"small"}
                pagination={false}
                scroll={{x: "max-content",}}
                rowSelection={rowSelection}
                rowKey={record => record.nUserId}
                locale={tableLocale}
            />
        </CContainer>
    </>

}