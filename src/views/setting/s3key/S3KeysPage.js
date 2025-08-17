import React, {memo, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useModals} from "../../../hooks/useModals";
import {Button, Input, Space, Table, TableProps, Tooltip} from "antd";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";
import {DeleteModal} from "../../../components/DeleteModal";
import {TableLocale} from "antd/es/table/interface";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilMenu} from "../../../assets/brand/cilMenu";
import CreateOrUpdateS3KeyRule from "./CreateOrUpdateS3KeyRule";
import {useSettingsKey} from "../../../hooks/setting/s3key/useSettingsKey";
import {useSettingKey} from "../../../hooks/setting/s3key/useSettingKey";
import {useDeleteSettingKey} from "../../../hooks/setting/s3key/useDeleteSettingKey";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import {useDepartments} from "../../../hooks/reference/department/useDepartments";
import {Link} from "react-router-dom";
import {cilPlus} from "@coreui/icons";


const S3KeysPage = memo(() => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedSettingId, setSelectedSettingId] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);

    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [departmentsFilter, setDepartmentsFilter] = useState([]);
    const [clusterFilter, setClusterFilter] = useState([]);

    const [departments, departmentsStatus] = useDepartments()
    const {data: clusters, state: clustersStatus} = useClusters();
    const [settings, settingsStatus] = useSettingsKey();
    const [setting, settingStatus] = useSettingKey(selectedSettingId);
    const [deleteSetting] = useDeleteSettingKey();


    const handleSelect = (id) => {
        setSelectedSettingId(id);
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
        const options = []
        if (departmentsStatus === "success") {
            departments && departments.length > 0 && departments?.map(item => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setDepartmentsFilter(options)
        }

    }, [departments, departmentsStatus]);

    useEffect(() => {
        const options = []
        if (clustersStatus === "success") {
            clusters && clusters.length > 0 && clusters?.map(item => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setClusterFilter(options)
        }
    }, [clusters, clustersStatus]);

    useEffect(() => {
        let result = []
        if (settings && settings.length > 0) {
            result = settings?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setClustersWithKey(result)
    }, [settings]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление настройки",
            text: `Вы уверены, что хотите удалить найстройку для кластера ${name}?`,
            onSubmit: async () => {
                deleteSetting(id);
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
            render: (item, record) => (<Link className={'table-link'} to={`/settings/s3key/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Кластер',
            dataIndex: 'clusterName',
            key: 'clusterName',
            render: (item, record) => (<Link className={'table-link'} to={`/settings/s3key/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.clusterName}</div>
            </Link>),
            filters: clusterFilter,
            filterSearch: true,
            filteredValue: filteredInfo.clusterId || null,
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
            render: (item, record) => (<Link className={'table-link'} to={`/settings/s3key/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>),
            ...getColumnSearchProps('bucket'),
            filteredValue: filteredInfo.bucket || null,
            filterSearch: true,
            sorter: (a, b) => a.bucket.length - b.bucket.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        {
            title: 'Отдел',
            dataIndex: 'departmentId',
            key: 'departmentId',
            filters: departmentsFilter,
            filterSearch: true,
            filteredValue: filteredInfo.departmentId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/settings/s3key/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.departmentName}</div>
            </Link>),
            onFilter: (value, record) => record.departmentId === parseInt(value),
            sorter: (a, b) => a.departmentId - b.departmentId,
            sortDirections: ['ascend', 'descend', 'ascend'],
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
                        <CDropdownItem onClick={() => onDelete(record?.id, record?.clusterName)}>
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
        }}>Ключи S3</h5>

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
            loading={settingsStatus === "loading"}
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
        <CreateOrUpdateS3KeyRule open={showEditDialog}
                                 data={setting}
                                 onClose={() => {
                                     setShowEditDialog(false)
                                     setSelectedSettingId("")
                                     navigate('/settings/s3key', {replace: true});
                                 }}/></>
});

export default S3KeysPage;
