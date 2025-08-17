import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";

import {SettingSynchModel} from "../../../models/setting/settingSynch.model";
import {message} from "antd";


export function useUpdateSettingSynch(): UpdateSetting {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: SettingSynchModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/api/setting/settingSync/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            message.error("Правило не может быть обновлено");
            return
        }


        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {mutate} = useMutation({
        mutationFn: ({data, afterUpdate}) => _useApi(data, afterUpdate),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.settingsSynch]);
                message.success("Правило синхронизации бакетов между кластерами было обновлено успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateSetting = ({ data: SettingSynchModel, afterUpdate: any }) => void