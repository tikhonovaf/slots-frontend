import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import type {ServerModel} from "../../../models/reference/server.model";


export function useServers(): UseQueryResult<ServerModel[], any> {


    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/api/servers/search`, {
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
        [queryKeys.servers],
        () => fetchData()
    )


}
