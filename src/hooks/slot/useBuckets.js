import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";

export function useBuckets(clusterId, bucketName): UseQueryResult<string[]> {

    // 
    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const search = `?startWith=${bucketName}`
        const response = await fetch(`/api/clusters/buckets/search/${clusterId}${search}`, {
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
        [queryKeys.buckets, {cluster: clusterId, bucketName: bucketName}],
        () => fetchData(), {
            enabled: !!clusterId
        }
    )
}
