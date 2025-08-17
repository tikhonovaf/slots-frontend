export type SlotModel = Partial<{
    nSlotId: number;
    dDate: string;
    dStartTime: string;
    dEndTime: string;
    nStoreId: number;
    vcStoreCode: string;
    vcStoreName: string;
    nLoadingPointId: number;
    vcLoadingPointCode: string;
    vcLoadingPointName: string;
    vcLoadingPointComment: string;
    nClientId: number;
    vcClientCode: string;
    vcClientName: string;
    vcStatus: string;

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
