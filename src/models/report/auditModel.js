export type AuditModel = Partial<{
    "id": number,
    "userId": number,
    "login": string,
    "userName": string,
    "resource": string,
    "objectId": number,
    "objectName": string,
    "action": string,
    "jsonValue": string,
    "createDateTime": string,

}>

export type AuditResponse = {
    "auditFullViewDtos": AuditModel[],
    "page": {
        "number": number,
        "size": number,
        "totalPages": number,
        "totalElements": number

    }
}




