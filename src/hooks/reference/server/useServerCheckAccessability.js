import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {ServerAccessStatusModel} from "../../../models/reference/serverAccessStatus.model";

export function useServerCheckAccessability(server): UseQueryResult<ServerAccessStatusModel, any> {


    const [removeCookie] = useCookies()
    const fetchData = async () => {

        const address = server?.serverUrls[0].url + ":" + server?.serverUrls[0].port
            const response = await fetch(`${address}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                },
            })
            return response.text()
                .then((data) => {
                    return (data ? JSON.parse(data) : {})
                })

    }

    const {
        data,
        status
    } = useQuery(
        [queryKeys.serverAddress, {server: server?.id}],
        () => fetchData(),
        {
            enabled: !!server?.id,
        })

    return [
        data,
        status
    ]
}
