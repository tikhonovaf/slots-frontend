import {useMutation, UseMutationResult, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import {message} from "antd";


export function useSynchNewSettingBalancing(): UseMutationResult {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()
    let _responseStatus: number

    const _useApi = async () => {
        const response = await fetch(`/api/syncSetup/syncSettingBalancing`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
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
        mutationFn: () => _useApi(),
        onSuccess: (data: any) => {
            if (_responseStatus === 204) {
                queryClient.invalidateQueries([queryKeys.settingsBalancing]);
                message.success("Синхронизация прошла успешно");
            }
        },

    })
}

