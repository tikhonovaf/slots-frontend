export type SettingTrafficModel = Partial<{
    id: number;
    ruleName: string;
    clusterId: number;
    clusterName: string;
    clusterUrl: string;
    session: string;
    method: string;
    recordTypes: [
        {
            recordTypeId: number;
            recordTypeName: string;
        }
    ];
    ipOriginal: string;
    bucket: string;
    userId: number;
    userName: string;
    rps: number;
    throughput: number;
    accessKey: string;
    changeDate: string;
    status: string;
    syncDate: string;

}>
