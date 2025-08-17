import React, {memo, useEffect, useRef, useState} from "react";
import {Button, Input, Space, Table, TableProps, Tooltip} from "antd";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {TableLocale} from "antd/es/table/interface";
import {useTrafficSettingsReport} from "../../hooks/report/useTrafficSettingsReport";
import {useUsers} from "../../hooks/reference/user/useUsers";
import {useClusters} from "../../hooks/reference/cluster/useClusters";
import type {UserModel} from "../../models/reference/user.model";
import type {ClusterModel} from "../../models/reference/cluster.model";


const TrafficControlReportPage = memo(() => {

    const [report, reportStatus] = useTrafficSettingsReport()

    const [dataWithKeys, setDataWithKeys] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [clusterFilter, setClusterFilter] = useState([]);

    const [users, usersStatus] = useUsers()
    const {data: clusters, state: clustersStatus} = useClusters();

    useEffect(() => {
        const options = []
        if (usersStatus === "success") {
            users && users.length > 0 && users?.map((item: UserModel) => {
                options.push({
                    text: item.lastName,
                    value: item.id,
                })
            })
            setUserFilter(options)
        }

    }, [users, usersStatus]);

    useEffect(() => {
        const options = []
        if (clustersStatus === "success") {
            clusters && clusters.length > 0 && clusters?.map((item: ClusterModel) => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setClusterFilter(options)
        }

    }, [clusters, clustersStatus]);


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

    useEffect(() => {
        let result = []
        if (report && report.length > 0) {
            result = report?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setDataWithKeys(result)
    }, [report]);


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
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },

        {
            title: 'Кластер',
            dataIndex: 'clusterId',
            key: 'clusterId',
            filters: clusterFilter,
            filterSearch: true,
            filteredValue: filteredInfo.clusterId || null,
            render: (item, record) =>
                <div style={{width: '100%'}}>{record.clusterName}</div>,
            onFilter: (value, record) => record.clusterId === parseInt(value),
            // ...getColumnSearchProps('clusterName'),
            sorter: (a, b) => a.clusterId - b.clusterId,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },

        {
            title: 'Бакет',
            dataIndex: 'bucket',
            key: 'bucket',
            ...getColumnSearchProps('bucket'),
            filteredValue: filteredInfo.bucket || null,
            filterSearch: true,
            sorter: (a, b) => a.bucket.length - b.bucket.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        // {
        //     title: 'Сессия',
        //     dataIndex: 'session',
        //     key: 'session',
        //     ...getColumnSearchProps('session'),
        //     filteredValue: filteredInfo.session || null,
        //     filterSearch: true,
        //     sorter: (a, b) => a.session.length - b.session.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },

        {
            title: 'Метод',
            dataIndex: 'method',
            key: 'method',
            ...getColumnSearchProps('method'),
            filteredValue: filteredInfo.method || null,
            filterSearch: true,
            sorter: (a, b) => a.method.length - b.method.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },


        {
            title: "Исходный IP",
            dataIndex: 'ipOriginal',
            key: 'ipOriginal',
            ...getColumnSearchProps('ipOriginal'),
            filteredValue: filteredInfo.ipOriginal || null,
            filterSearch: true,
            sorter: (a, b) => a.ipOriginal.length - b.ipOriginal.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },


        {
            title: "Число запросов в сек.",
            dataIndex: 'rps',
            key: 'rps',
            ...getColumnSearchProps('rps'),
            filteredValue: filteredInfo.rps || null,
            filterSearch: true,
            sorter: (a, b) => a.rps.length - b.rps.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        {
            title: "Пропускная способность",
            dataIndex: 'throughput',
            key: 'throughput',
            ...getColumnSearchProps('throughput'),
            filteredValue: filteredInfo.throughput || null,
            filterSearch: true,
            sorter: (a, b) => a.throughput.length - b.throughput.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        {
            title: 'Пользователь',
            dataIndex: 'userId',
            key: 'userId',
            filters: userFilter,
            filterSearch: true,
            filteredValue: filteredInfo.userId || null,
            render: (item, record) =>
                <div style={{width: '100%'}}>{record.userName}</div>,
            onFilter: (value, record) => record.userId === parseInt(value),
            sorter: (a, b) => a.userId - b.userId,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        {
            title: 'Комментарий',
            dataIndex: 'ruleName',
            key: 'ruleName',
            ...getColumnSearchProps('ruleName'),
            filteredValue: filteredInfo.ruleName || null,
            filterSearch: true,
            sorter: (a, b) => a.ruleName.length - b.ruleName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },



    ];

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}>Отчет по лимитам и квотам</h5>


        <Space
            style={{
                margin: '0px 0 20px 0',
                float: 'right'
            }}
        >
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="circle" icon={<ClearOutlined/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={reportStatus === "loading"}
            columns={columns}
            dataSource={dataWithKeys}
            onChange={onChange}
            size={"small"}
            pagination={{
                defaultPageSize: defaultPageSize,
                showSizeChanger: true,
            }}
            locale={tableLocale}
        />
    </>
});

export default TrafficControlReportPage;
