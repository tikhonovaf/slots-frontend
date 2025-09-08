import CIcon from "@coreui/icons-react";
import {Button, Input, message, Space, Spin, Table, TableProps, Tooltip, Alert} from "antd";
import {CContainer} from "@coreui/react";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import {useLoadingPoints} from "../../../hooks/reference/loading-point/useLoadingPoints";

import {cilBrushAlt, cilLink, cilPlus, cilTrash} from "@coreui/icons";

export const LoadingPointsPage = ({ nStoreId }) => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState("");
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

console.log('nStoreId', nStoreId);

    const [loadingPoints, loadingPointsStatus] = useLoadingPoints(nStoreId);

    const handleSelect = (id) => {
        setSelectedStoreId(id);
        setShowEditDialog(true)
    }

    useEffect(() => {
        if (params?.nStoreId) {
            handleSelect(params?.nStoreId);
        }
    }, [params]);

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
            render: (item, record) => (<Link className={'table-link'} to={`/references/stores/${record.nStoreId}`}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Код',
            dataIndex: 'vcCode',
            key: 'vcCode', ...getColumnSearchProps('vcCode'),
            filteredValue: filteredInfo.vcCode || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/stores/${record.nStoreId}`}
                                            onClick={() => handleSelect(record.nStoreId)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.vcCode.length - b.vcCode.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        }, 
        {
            title: 'Наименование',
            dataIndex: 'vcName',
            key: 'vcName', ...getColumnSearchProps('vcName'),
            filteredValue: filteredInfo.vcName || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/stores/${record.nStoreId}`}
                                            onClick={() => handleSelect(record.nStoreId)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.vcName.length - b.vcName.length,
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
        }}>Пункты налива</h5>

        <Space
            style={{
                margin: '0px', float: 'right'
            }}
        >
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="rounde" icon={<CIcon icon={cilBrushAlt}/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>
            {
                !!nStoreId 
                    ? (
                        <Table
                            loading={loadingPointsStatus === "loading"}
                            columns={columns}
                            dataSource={loadingPoints}
                            onChange={handleTableChange}
                            size={"small"}
                            // pagination={{
                            //     defaultPageSize: defaultPageSize,
                            //     showSizeChanger: true,
                            // }}
                            pagination={false}
                            scroll={{x: "max-content",}}
                            rowSelection={rowSelection}
                            rowKey={record => record.nStoreId}
                            locale={tableLocale}
                        />

                    )
                    : (
                        <Alert 
                            style={{marginTop: '40px'}}
                            message="Для просмотра пунктов налива необходимо сначала выбрать нефтебазу"
                            type="error"
                        />
                    )
            }
        </CContainer>
    </>

}