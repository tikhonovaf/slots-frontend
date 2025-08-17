import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {ClusterModel} from "../../../models/reference/cluster.model";

export function useClusters(name?): UseQueryResult<ClusterModel[]> {

    // 
    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const search = name ? `?startWith=${name}` : ""
        const response = await fetch(`/api/clusters/search${search}`, {
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
        [queryKeys.clusters, {name: name}],
        () => fetchData(),
    )
}
