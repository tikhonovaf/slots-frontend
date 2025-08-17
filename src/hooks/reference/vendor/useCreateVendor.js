import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import {VendorModel} from "../../../models/reference/vendor.model";
import {message} from "antd";

export function useCreateVendor(): CreateVendor {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (vendor: VendorModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/ref/vendors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(vendor),
        })

        if (response.status !== 204) {
            message.error("Вендор не может быть создан");
            return
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
                queryClient.invalidateQueries([queryKeys.vendors]);
                message.success("Вендор был создан успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateVendor = ({data: VendorModel, afterCreate: any}) => void