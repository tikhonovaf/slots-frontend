import {useMutation, UseMutationResult, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import {message} from "antd";


export function useSynchByIdsSettingBalancing(): UseMutationResult {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()
    let _responseStatus: number

    const _useApi = async (ids) => {
        const response = await fetch(`/api/syncSetup/syncSettingBalancing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(ids)
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
        mutationFn: (ids) => _useApi(ids),
        onSuccess: (data: any) => {
            if (_responseStatus === 204) {
                queryClient.invalidateQueries([queryKeys.settingsBalancing]);
                message.success("Синхронизация прошла успешно");
            }
        },

    })
}

