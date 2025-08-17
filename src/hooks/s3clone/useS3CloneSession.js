import {useQuery} from "react-query";
import {useCookies} from "react-cookie";
import {message} from "antd";
import type {S3CloneSessionModel} from "../../models/s3clone/s3cloneSession.model";
import queryKeys from "../queryKeys";

export function useS3CloneSession(id): [S3CloneSessionModel, 'loading' | 'error' | 'success'] {


    const [removeCookie] = useCookies()
    const fetchData = async () => {
        const response = await fetch(`/clone/sessions/${id}`, {
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

    const {
        data,
        status
    } = useQuery(
        [queryKeys.cloneSession, {id: id}],
        () => fetchData(),
        {
            enabled: !!id,
            onSuccess: (data: any) => {
                if (data.message) {
                    message.error(data.message)
                }
            },
        })

    return [
        data,
        status
    ]
}
