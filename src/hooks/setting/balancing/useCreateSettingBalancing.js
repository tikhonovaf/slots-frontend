import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";

import {SettingBalancingModel} from "../../../models/setting/settingBalancing.model";
import {message} from "antd";


export function useCreateSettingBalancing(): CreateSetting {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (data: SettingBalancingModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/setting/settingBalancing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
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

    const {mutate} = useMutation({
        mutationFn: ({data, afterCreate}) => _useApi(data, afterCreate),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.settingsBalancing]);
                message.success("Правило маршрутизации и балансировки было создано успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateSetting = ({ data: SettingBalancingModel, afterCreate: any }) => void