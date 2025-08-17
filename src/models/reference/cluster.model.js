export type ClusterModel = Partial<{
    id: number;
    name: string;
    comment: string;
    userId: string;
    userName: string;
    vendorId: number;
    vendorName: string;
    accessKey: string;
    secretKey: string;
    clusterUrls: [
        {
            url: string;
            port: string;
            addressRegExp: string;
            isRegExp: boolean
        }
    ]
}>
