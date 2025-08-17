import {useMutation, UseMutationResult, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import {message} from "antd";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";


export function useLoadFromClusterSettingBalancing(): UseMutationResult {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()
    let responseStatus: any;

    const _useApi = async (clusters) => {

        clusters.map((item) => {
            try {

                const data$ = fromFetch(`/api/clusters/settingBalancing/loadFromCluster/${item.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', // 'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },

                }).pipe(switchMap(response => {
                    if (response.ok) {
                        // OK return data
                        return response.json();
                    } else {
                        // Server is returning a status requiring the client to try something else.
                        return of({error: true, message: `Error ${response.status}`});
                    }
                }), catchError(err => {
                    // Network or other error, handle appropriately
                    // console.error(err);
                    return of({error: true, message: err.message})

                }));

                data$.subscribe({
                    next: result => {

                    },
                    complete: () => {
                        queryClient.invalidateQueries([queryKeys.settingsBalancing]);
                        message.success("Правила маршрутизации и балансировки были успешно загружены для кластера " + item.name);
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })


    }

    return useMutation({
        mutationFn: (clusters) => _useApi(clusters),


    })
}

