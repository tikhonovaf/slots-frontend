export type SettingBalancingModel = Partial<{
    id: number;
    bucket: string;
    clusterId: number;
    clusterName: string;
    clusterUrl: string;
    userId: number;
    userName: string;
    recordTypes: [
        {
            recordTypeId: number;
            recordTypeName: string;
        }
    ];
    accessKey: string;
    changeDate: string;
    status: string;
    syncDate: string;

}>


