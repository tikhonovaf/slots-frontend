import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {Button, Input, message, Space, Table, TableProps, Tooltip} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {TableLocale} from "antd/es/table/interface";
import {useModals} from "../../../hooks/useModals";
import {Link} from "react-router-dom";
import CIcon from "@coreui/icons-react";
import {cilBrushAlt, cilMediaPlay, cilPlus, cilTrash} from "@coreui/icons";
import moment from "moment";
import CreateOrUpdateS3Session from "./CreateOrUpdateS3Session";
import {cilStop} from "../../../assets/brand/cilStop";
import {useNavigate} from "react-router";
import {useS3CloneSessions} from "../../../hooks/s3clone/useS3CloneSessions";
import {useS3CloneSession} from "../../../hooks/s3clone/useS3CloneSession";


const CloneSessionPage = memo(() => {

    const navigate = useNavigate();

    const modals = useModals();
    const [dataWithKeys, setDataWithKeys] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [clusterFilter, setClusterFilter] = useState([]);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState("");

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const {data: sessions, status: clickHouseDataStatus} = useS3CloneSessions()
    const [session] = useS3CloneSession(selectedSessionId)


    useEffect(() => {
        let result = []
        if (sessions && sessions.length > 0) {
            result = sessions?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setDataWithKeys(result)
    }, [sessions]);

    const handleSelect = (id) => {
        setSelectedSessionId(id);
        setShowEditDialog(true)
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => (
            <div
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
                        marginBottom: 8,
                        display: 'block',
                        width: 250,
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
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
        filterReset: <span onClick={clearFilters}>{'Очистить'}</span>,

    }

    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo(filters);
    };


    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            defaultSortOrder: 'descend',
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>),
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },

        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.name}</div>
            </Link>),
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
        },

        {
            title: 'Статус',
            dataIndex: 'state',
            key: 'state',
            ...getColumnSearchProps('state'),
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>),
            // filteredValue: filteredInfo.bucket || null,
            // filterSearch: true,
            sorter: (a, b) => a?.state?.length - b?.state?.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            // width: '30%'
        },
        {
            title: 'Дата создания',
            dataIndex: 'created',
            key: 'created',
            ...getColumnSearchProps('created'),
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{moment(record?.created).format("YYYY-MM-DD HH:mm:ss")}</div>
            </Link>),
            filteredValue: filteredInfo.accessKey || null,
            filterSearch: true,
            sorter: (a, b) => a?.accessKey?.length - b?.accessKey?.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            // width: '30%'
        },
        {
            title: 'Дата изменения',
            dataIndex: 'updated',
            key: 'updated',
            ...getColumnSearchProps('updated'),
            // filterSearch: true,
            // filteredValue: filteredInfo.recordTypeId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{moment(record?.updated).format("YYYY-MM-DD HH:mm:ss")}</div>
            </Link>),
            // onFilter: (value, record) => record.recordTypeId === parseInt(value),
            // sorter: (a, b) => a.recordTypeId - b.recordTypeId,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            // width: '120px',
        },
    ];

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
        setSelectedRows(selectedRows)
        setSelectedIds(selectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
                setSelectedIds([]);
                setSelectedRows([])
            }
        }, onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)
        },
    };

    const runSession = useCallback(() => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите сессию");
        }

    }, [selectedRowKeys, selectedRows])

    const stopSession = useCallback(() => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите сессию");
        }

    }, [selectedRowKeys, selectedRows])

    const deleteSession = useCallback(() => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите сессию");
        }

    }, [selectedRowKeys, selectedRows])

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}> Быстрое копирование</h5>

        <Space
            style={{
                margin: '0px 0 20px 0',
                float: 'right'
            }}>

            <Tooltip title={"Добавить сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => setShowEditDialog(true)}
                />
            </Tooltip>

            <Tooltip title={"Удалить сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilTrash}/>}
                    // loading={deleteInProgress}
                    // disabled={deleteInProgress}
                        onClick={() => deleteSession()}
                />
            </Tooltip>

            <Tooltip title={"Начать сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilMediaPlay}/>}
                        onClick={() => runSession()}
                />
            </Tooltip>

            <Tooltip title={"Остановить сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilStop}/>}
                        onClick={() => stopSession()}
                />
            </Tooltip>


            <Tooltip title={"Очистить фильтр"}>
                <Button shape="rounde" icon={<CIcon icon={cilBrushAlt}/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>


        <Table
            // loading={clickHouseDataStatus === "loading"}
            columns={columns}
            dataSource={dataWithKeys}
            onChange={onChange}
            size={"small"}
            pagination={{
                defaultPageSize: defaultPageSize,
                showSizeChanger: true,
            }}
            rowSelection={rowSelection}
            rowKey={record => record.id}
            locale={tableLocale}
        />
        <CreateOrUpdateS3Session open={showEditDialog}
                                 data={session}
                                 onClose={() => {
                                     setShowEditDialog(false)
                                     setSelectedSessionId("")
                                     navigate('/s3clone', {replace: true});
                                 }}/>
    </>
});

export default CloneSessionPage;
