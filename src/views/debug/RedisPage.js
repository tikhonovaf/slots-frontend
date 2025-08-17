import React, {memo, useEffect, useRef, useState} from "react";
import {Button, Input, Space, Table, TableProps, Tooltip} from "antd";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {TableLocale} from "antd/es/table/interface";
import {useRedis} from "../../hooks/debug/useRedis";
import {CFormInput} from "@coreui/react";


const RedisPage = memo(() => {

    const [dataWithKeys, setDataWithKeys] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [pattern, setPattern] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);

    const {data: redisData, status: redisStatus} = useRedis(pattern)

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
        if (redisData && redisData.length > 0) {
            result = redisData?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    id: index + 1
                }))
        }
        setDataWithKeys(result)
    }, [redisData]);


    const clearFilters = () => {
        setFilteredInfo({});
        setSearchText("");
        setPattern("")
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
            dataIndex: 'id',
            key: 'id',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Ключ',
            dataIndex: 'key',
            key: 'key',
            ...getColumnSearchProps('key'),
            filteredValue: filteredInfo.key || null,
            filterSearch: true,
            sorter: (a, b) => a.key.length - b.key.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        {
            title: 'Значение',
            dataIndex: 'value',
            key: 'value',
            ...getColumnSearchProps('value'),
            filteredValue: filteredInfo.value || null,
            filterSearch: true,
            sorter: (a, b) => a.value.length - b.value.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

    ];

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}>Redis</h5>


        <Space
            style={{
                margin: '0px 0 20px 10px',
                width: '100%'
            }}
        >
            <Tooltip title={"Например, r*"}>
                <CFormInput
                    className={"mb-3"}
                    label={"Укажите паттерн"}
                    style={{width: '250px'}}
                    // type={"password"}
                    // disabled={data}
                    // required
                    value={pattern}
                    onChange={(e) =>
                        setPattern(e.target.value)
                    }
                />
            </Tooltip>
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="circle" icon={<ClearOutlined/>} style={{margin: '10px 5px -10px 5px'}}
                        onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={redisStatus === "loading"}
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

export default RedisPage;
