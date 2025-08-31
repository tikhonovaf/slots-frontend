import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../queryKeys";
import {useCookies} from "react-cookie";
import type {ChangeSlotStatusParametersModel} from "../../models/slot/change-slot-status.model";
import {message} from "antd";


export function useChangeSlotStatus(): ChangeSlotStatusModel {
    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()

    let _callbackSuccess: any;
    let _callbackError: any;

    const _useApi = async (data: GenerateSloChangeSlotStatusParametersModeltModel, afterSuccess: any, afterError: any) => {
        _callbackSuccess = afterSuccess;
        _callbackError = afterError;

        const response = await fetch(`/api/slots`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status !== 204) {
            return {error: `${response.status}: Слоты не удалось зарезервировать`}
        }
        return response.json()
            .then((data) => data)
    }

    const {mutate} = useMutation({
        mutationFn: ({data, afterSuccess, afterError}) => _useApi(data, afterSuccess, afterError),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
                _callbackError && _callbackError(data);
            } else {
                queryClient.invalidateQueries([queryKeys.slots]);
                message.success("Слоты были сгенерены");
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