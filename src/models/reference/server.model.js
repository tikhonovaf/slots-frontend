export type ServerModel = Partial<{
    name: string,
    serverTypeId: number,
    serverTypeName: string,
    comment: string,
    serverUrls: [
        {
            url: string,
            port: string,
            addressRegExp: string,
            isRegExp: boolean
        }
    ]
}>

export type ServerTypeModel = {
    id: number;
    name: string;
    description?: string;

}
