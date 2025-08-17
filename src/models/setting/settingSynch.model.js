export type SettingSynchModel = Partial<{
    id: number;
    name: string;
    clusterSourceId: 1;
    clusterSourceName: string;
    bucketSource: string;
    clusterTargetId: 1;
    clusterTargetName: string;
    bucketTarget: string;

}>
