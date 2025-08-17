import {useInfiniteQuery, UseInfiniteQueryResult} from "react-query";
import {useCookies} from "react-cookie";
import {AuditResponse} from "../../models/report/auditModel";
import queryKeys from "../queryKeys";


export function useAudit(currentPageParam?: any): UseInfiniteQueryResult<AuditResponse, Error> {

    const [cookies, setCookie, removeCookie] = useCookies()
    const fetchData = async (pageParam) => {

        const response = await fetch(`/api/admin/audit/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                auditSearchFilter: currentPageParam?.filter || {},
                // sort: pageParam?.sort || [
                //     {
                //         columnName: 'id',
                //         sortDirection: "DESC"
                //     }
                // ],
                paging: {
                    number: currentPageParam?.current || 0,
                    size: currentPageParam?.pageSize || 15
                }
            })
        })

        if (response.status === 403) {
            removeCookie('session', {path: '/'});
            window.location.reload()
        }

        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })

    }

    return useInfiniteQuery({
        queryKey: [queryKeys.audit, currentPageParam],//,
        queryFn: ({pageParam}) => fetchData(pageParam),
        getNextPageParam: (lastPage, pages) => pages?.length > 0
    })
}