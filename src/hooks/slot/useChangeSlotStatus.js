import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../queryKeys";
import {useCookies} from "react-cookie";
import type {ChangeSlotStatusParametersModel} from "../../models/slot/change-slot-status.model";
import {message} from "antd";


export function useChangeSlotStatus(type:string): ChangeSlotStatusModel {
    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()

    let _callbackSuccess: any;
    let _callbackError: any;

    const _useApi = async (data: ChangeSlotStatusParametersModel, afterSuccess: any, afterError: any) => {
        _callbackSuccess = afterSuccess;
        _callbackError = afterError;

        const response = await fetch(`/api/slots/${type}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status >= 400) {
            return type === 'free'
                ? {error: `${response.status}: Слоты не удалось освободить`}
                : {error: `${response.status}: Слоты не удалось зарезервировать`}
        }
        return response.json().then(data => data)
    }

    const {mutate} = useMutation({
        mutationFn: ({data, afterSuccess, afterError}) => _useApi(data, afterSuccess, afterError),
        onSuccess: (data: any) => {
            console.log(Array.isArray(data), data);

            if (Array.isArray(data)) {
                queryClient.invalidateQueries([queryKeys.slots]);
                queryClient.refetchQueries([queryKeys.slots])
                data.forEach(m => message.info(m));
                _callbackSuccess && _callbackSuccess(data);
            }
            else if (data.message || data.error) {
                message.error(data.message || data.error)
                _callbackError && _callbackError(data);
            } else {
                queryClient.invalidateQueries([queryKeys.slots]);
                queryClient.refetchQueries([queryKeys.slots])
                message.success(type === 'free' ? 'Слоты были освобождены' : 'Слоты были зарезервированы');
                _callbackSuccess && _callbackSuccess(data);
            }
        },
        onError: (err: any) => {
            _callbackError && _callbackError(err);
        }

    })
    return mutate
}

type ChangeSlotStatusModel = ({data: ChangeSlotStatusParametersModel[], afterSuccess: any, afterError: any}) => void