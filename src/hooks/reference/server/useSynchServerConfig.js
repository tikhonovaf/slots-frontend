import {useMutation, UseMutationResult, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";


export function useSynchServerConfig(): UseMutationResult {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()
    let _responseStatus: number

    const _useApi = async (serverId: number) => {
        const response = await fetch(`/api/syncSetup/syncNginxConfig/${serverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
        _responseStatus = response.status
        if (response.status === 403) {
            removeCookie('session', {path: '/'});
            window.location.reload()
        }
        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    return useMutation({
        mutationFn: ({serverId}) => _useApi(serverId),
        onSuccess: (data: any) => {
            if (_responseStatus === 204) {
                queryClient.invalidateQueries([queryKeys.servers]);
                message.success("Синхронизация прошла успешно");
            }
        },

    })
}

