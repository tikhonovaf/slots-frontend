export type ClusterAccessStatusModel = Partial<{
    status: string,
    infoUrls: [
        {
            endpoiont: string,
            responseCode: number,
            status: string,
            errorMsg: string,
        }
    ]
}>
