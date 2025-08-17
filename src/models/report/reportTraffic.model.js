export type ReportTrafficModel = Partial<{
    bucket: string;
    clusterId: number;
    clusterName: string;
    id: number;
    recordTypeId: number;
    recordTypeName: string;
    userId: number;
    userName: string;
    ipOriginal: string;
    method: string;
    rps: number;
    ruleName: string;
    session: string;
    throughput: number;

}>
