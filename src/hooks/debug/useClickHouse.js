import {useQuery, UseQueryResult} from "react-query";
import {useCookies} from "react-cookie";
import queryKeys from "../queryKeys";
import {message} from "antd";


export function useClickHouse(clusterName): UseQueryResult {

    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const search = clusterName ? `?clusterName=${clusterName}` : ""
        const response = await fetch(`/api/syncSetup/clickHouse/s3trafLogs/thresholds${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
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

    return useQuery(
        [queryKeys.clickHouseDebug, {clusterName: clusterName}],
        () => fetchData(),

        {
            // enabled: !!clusterName,
            onSuccess: (data: any) => {
                if (data.message) {
                    message.error(data.message)
                }
            },
        })


}
