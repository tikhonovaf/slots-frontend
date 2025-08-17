import React, {memo, useEffect, useRef, useState} from "react";
import {Button, Input, Select, Space, Spin, Table, TableProps, Tooltip} from "antd";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {TableLocale} from "antd/es/table/interface";
import {useUsers} from "../../hooks/reference/user/useUsers";
import {useClusters} from "../../hooks/reference/cluster/useClusters";
import type {UserModel} from "../../models/reference/user.model";
import type {ClusterModel} from "../../models/reference/cluster.model";
import {useClickHouse} from "../../hooks/debug/useClickHouse";
import {SelectClusterModal} from "../setting/balancing/SelectClusterModal";
import {useModals} from "../../hooks/useModals";
import {CCol, CFormLabel} from "@coreui/react";


const ClickHousePage = memo(() => {


    const modals = useModals();
    const [dataWithKeys, setDataWithKeys] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [clusterFilter, setClusterFilter] = useState([]);
    const [selectedClusterId, setSelectedClusterId] = useState();
    const [users, usersStatus] = useUsers()
    const [clusterId, setClusterId] = useState("");
    const [clusterName, setClusterName] = useState("");
    const [clusterOptions, setClusterOptions] = useState([]);
    const [searchClusterByName, setSearchClusterByName] = useState("");
    const {data: clusters, status: clusterStatus, isFetched: clusterIsFetched} = useClusters(searchClusterByName);
    const {data: clickHouseData, status: clickHouseDataStatus} = useClickHouse(clusterName)

    useEffect(() => {
        let result = []
        if (clickHouseData && clickHouseData.length > 0) {
            result = clickHouseData?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setDataWithKeys(result)
    }, [clickHouseData]);

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
        if (clusterIsFetched && clusters) {
            clusters && clusters.length > 0 && clusters?.map((item: ClusterModel) => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setClusterFilter(options)
        }

    }, [clusters, clusterIsFetched]);

    useEffect(() => {
        if (clusterIsFetched && clusters) {
            if (clusters?.length > 0) {
                const opts = clusters?.map((el) => {
                    return {value: el?.id, label: el?.name}
                })
                setClusterOptions(opts)
            } else {
                setClusterOptions([])
            }
        }
    }, [clusters, clusterIsFetched])


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
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },

        {
            title: 'Кластер',
            dataIndex: 'clusterName',
            key: 'clusterName',
            filters: clusterFilter,
            filterSearch: true,
            filteredValue: filteredInfo.clusterName || null,
            render: (item, record) =>
                <div style={{width: '100%'}}>{record.clusterName}</div>,
            // onFilter: (value, record) => record.clusterId === parseInt(value),
            // ...getColumnSearchProps('clusterName'),
            sorter: (a, b) => a.clusterName.length - b.clusterName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },

        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
            filteredValue: filteredInfo.address || null,
            filterSearch: true,
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },


        {
            title: 'Метод',
            dataIndex: 'method',
            key: 'method',
            ...getColumnSearchProps('method'),
            filteredValue: filteredInfo.method || null,
            filterSearch: true,
            render: (item, record) =>
                <div style={{width: '100%'}}>{item === "" ? "Все" : item}</div>,
            sorter: (a, b) => a.method.length - b.method.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },


        // {
        //     title: "Исходный IP",
        //     dataIndex: 'ipOriginal',
        //     key: 'ipOriginal',
        //     ...getColumnSearchProps('ipOriginal'),
        //     filteredValue: filteredInfo.ipOriginal || null,
        //     filterSearch: true,
        //     sorter: (a, b) => a.ipOriginal.length - b.ipOriginal.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },


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
        // {
        //     title: 'Пользователь',
        //     dataIndex: 'userId',
        //     key: 'userId',
        //     filters: userFilter,
        //     filterSearch: true,
        //     filteredValue: filteredInfo.userId || null,
        //     render: (item, record) =>
        //         <div style={{width: '100%'}}>{record.userName}</div>,
        //     onFilter: (value, record) => record.userId === parseInt(value),
        //     sorter: (a, b) => a.userId - b.userId,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },

        // {
        //     title: 'Комментарий',
        //     dataIndex: 'ruleName',
        //     key: 'ruleName',
        //     ...getColumnSearchProps('ruleName'),
        //     filteredValue: filteredInfo.ruleName || null,
        //     filterSearch: true,
        //     sorter: (a, b) => a.ruleName.length - b.ruleName.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },
    ];

    const onLoadFromCluster = () => {
        modals.openModal(SelectClusterModal, (modalId) => ({
            title: "Загрузка данных из Click House",
            text: `Выберите кластер, из которого нужно загрузить правила`,
            onSubmit: (id, name) => {
                // loadFromCluster(id);
                modals.closeModal(modalId);
            },
        }));
    };

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}>Click House</h5>


        <Space
            style={{
                margin: '0px 0 20px 10px',
                width: '100%'
            }}
        >
            <div>
                <CFormLabel>
                    Выберите кластер
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        // suffixIcon={errors && !newSetting?.clusterId ? <ErrorIcon/> : <span/>}
                        style={{width: '250px'}}
                        value={clusterId}
                        showSearch
                        options={clusterOptions}
                        notFoundContent={clusterStatus === "loading" ?
                            <Spin size="small"/> : null}
                        virtual
                        autoClearSearchValue
                        allowClear
                        onSearch={(value) => setSearchClusterByName(value)}
                        filterOption={false}
                        onChange={(value, option) => {
                            setClusterId(option?.value)
                            setClusterName(option?.label)
                        }}
                    />
                </CCol>
            </div>
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="circle" icon={<ClearOutlined/>} style={{margin: '10px 5px -10px 5px'}}
                        onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={clickHouseDataStatus === "loading"}
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

export default ClickHousePage;
