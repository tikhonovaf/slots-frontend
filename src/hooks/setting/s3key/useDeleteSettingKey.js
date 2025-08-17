import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import {message} from "antd";


export function useDeleteSettingKey(): [DeleteSetting, 'idle' | 'loading' | 'success' | 'error'] {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies();

    const _useApi = async (id: string) => {
        const response = await fetch(`/api/setting/settingKeys/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        })

        if (response.status === 403) {
            removeCookie('session', {path: '/'});
            window.location.reload();
        }
        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {mutate, status} = useMutation({
        mutationFn: (id: string) => _useApi(id),
        onSuccess: (data) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.settingsKey]);
                message.success("Правило s3 ключа к бакетам было удалено успешно");
            }
        }
    })
    return [mutate, status]
}

type DeleteSetting = (id: string) => void