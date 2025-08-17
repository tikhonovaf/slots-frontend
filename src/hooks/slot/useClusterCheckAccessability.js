import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {ClusterAccessStatusModel} from "../../../models/reference/clusterAccessStatus.model";
import {message} from "antd";


export function useClusterCheckAccessability(id): UseQueryResult<ClusterAccessStatusModel, any> {


    const [removeCookie] = useCookies()
    const fetchData = async () => {
        // try {
        const ac = new AbortController()
        setTimeout(() => ac.abort(), 5000)

        const response = await fetch(`/api/clusters/checkAvailability/${id}`, {
            method: 'GET',
            signal: ac.signal,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },

        })
        // if (response.status === 403) {
        //     removeCookie('session', {path: '/'});
        //     window.location.reload()
        // }

        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
        // } catch (e) {
        //     console.log("Check connection was cancelled")
        // }
    }

    return useQuery(
        [queryKeys.checkAccess, {id: id}],
        () => fetchData(),
        {
            enabled: !!id,
            retry: false,
            // retryDelay:1000,
            onSuccess: (data: any) => {
                if (data.message) {
                    message.error(data.message)
                }
            },
        })
}
