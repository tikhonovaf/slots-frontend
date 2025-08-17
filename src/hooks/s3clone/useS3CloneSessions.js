import {useQuery, UseQueryResult} from "react-query";
import {useCookies} from "react-cookie";
import queryKeys from "../queryKeys";


export function useS3CloneSessions(): UseQueryResult {


    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/clone/sessions`, {
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
        [queryKeys.cloneSessions],
        () => fetchData(),
        {
            // onSuccess: (data: any) => {
            //     if (data.message) {
            //         message.error(data.message)
            //     }
            // },
        })

}
