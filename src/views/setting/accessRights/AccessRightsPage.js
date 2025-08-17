import React, {memo, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useModals} from "../../../hooks/useModals";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import {useCluster} from "../../../hooks/reference/cluster/useCluster";
import {useDeleteCluster} from "../../../hooks/reference/cluster/useDeleteCluster";
import {useVendors} from "../../../hooks/reference/vendor/useVendors";
import {Button, Input, Space, Table, TableProps, Tooltip} from "antd";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {DeleteModal} from "../../../components/DeleteModal";
import {TableLocale} from "antd/es/table/interface";
import {Link} from "react-router-dom";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilMenu} from "../../../assets/brand/cilMenu";
import CreateOrUpdateAccessRightsRule from "./CreateOrUpdateAccessRightsRule";
import {cilPlus} from "@coreui/icons";


const AccessRightsPage = memo(() => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedClusterId, setSelectedClusterId] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);

    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);

    const {data: clusters, state: clustersStatus} = useClusters();
    const [cluster, clusterStatus] = useCluster(selectedClusterId);
    const [deleteCluster] = useDeleteCluster();
    const [vendors, vendorsStatus] = useVendors();

    const handleSelect = (id) => {
        setSelectedClusterId(id);
        setShowEditDialog(true)
    }

    useEffect(() => {
        if (params?.id) {
            handleSelect(params?.id);
        }
    }, [params]);

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
        if (clusters && clusters.length > 0) {
            result = clusters?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setClustersWithKey(result)
    }, [clusters]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление настройки",
            text: 'Вы уверены, что хотите удалить найстройку ?',// + `${name}` + '?',
            onSubmit: async () => {
                deleteCluster(id);
                modals.closeModal(modalId);
            },
        }));
    };
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
        // emptyText: <div style={{backgroundImage:cilMenu}}>Нет данных</div>,
    }

    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo(filters);
        // setSearchText(filters.clusterName);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            render: (item, record) => (<Link className={'table-link'} to={`/references/clusters/${record.id}`}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            width: '30%'
        },
        {
            title: 'Ссылка',
            dataIndex: 'url',
            key: 'url',
            filterSearch: true,
            filteredValue: filteredInfo.url || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}><Link to={item}>{item}</Link></div>
            </Link>,
            ...getColumnSearchProps('url'),
            // sorter: (a, b) => a.description.length - b.description.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            width: '15%',
        },
        {
            title: 'Вендор',
            dataIndex: 'vendorId',
            key: 'vendorId',
            filterSearch: true,
            filteredValue: filteredInfo.vendorId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.vendorName}</div>
            </Link>,
            ...getColumnSearchProps('vendorId'),
            // sorter: (a, b) => a.description.length - b.description.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            width: '15%',
        },
        {
            title: 'Описание',
            dataIndex: 'comment',
            key: 'comment',
            ...getColumnSearchProps('comment'),
            filteredValue: filteredInfo.name || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            // sorter: (a, b) => a.name.length - b.name.length,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            width: '5%',
            render: (item, record) =>
                <CDropdown
                    variant={"btn-group"}
                    className={"dropdown-position"}
                >
                    <CDropdownToggle custom>
                        <CIcon icon={cilMenu}/>
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem onClick={() => onDelete(record?.id, record?.name)}>
                            Удалить
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>,
        },
    ];

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}>Права пользователей</h5>

        <Space
            style={{
                margin: '0px',
                float: 'right'
            }}
        >
            <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                    onClick={() => setShowEditDialog(true)}>Добавить правило</Button>
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="circle" icon={<ClearOutlined/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={clustersStatus === "loading"}
            columns={columns}
            dataSource={clustersWithKey}
            onChange={onChange}
            size={"small"}
            pagination={{
                defaultPageSize: defaultPageSize,
                showSizeChanger: true,
            }}
            locale={tableLocale}
        />
        <CreateOrUpdateAccessRightsRule open={showEditDialog}
                                        data={cluster}
                                        onClose={() => {
                                            setShowEditDialog(false)
                                            setSelectedClusterId("")
                                            navigate('/settings/access', {replace: true});
                                        }}/></>
});

export default AccessRightsPage;
