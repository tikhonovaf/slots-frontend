import React, {memo} from "react";
import {Route, Routes} from "react-router-dom";

import DefaultLayout from "./layout/DefaultLayout";
import Page404 from "./views/page404/Page404";
import {ReactRouter6Adapter} from "use-query-params/adapters/react-router-6";
import {QueryParamProvider} from "use-query-params";
import MainPage from "./views/MainPage";

import ReportsPage from "./views/report/ReportsPage";
import ReferencesPage from "./views/reference/ReferencesPage";
import MainSlotsPage from "./views/slot/MainSlotsPage";
import SettingsPage from "./views/setting/SettingsPage";
import DebugPage from "./views/debug/DebugPage";
import BucketClonePage from "./views/s3clone/synch/BucketClonePage";

export const Routing = memo(() => {

    return <>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
            <Routes>

                <Route path={"*"} element={<DefaultLayout/>}>
                    {<Route
                        path={"*"}
                        element={<MainPage/>}
                    />}

                    {<Route
                        path={"settings"}
                        element={<SettingsPage activeTab={1}/>}
                    />}
                    {/*{<Route*/}
                    {/*    path={"settings/s3key"}*/}
                    {/*    element={<SettingsPage activeTab={1}/>}*/}
                    {/*/>}*/}

                    {/*{<Route*/}
                    {/*    path={"settings/s3key/:id"}*/}
                    {/*    element={<SettingsPage activeTab={1}/>}*/}
                    {/*/>}*/}

                    {<Route
                        path={"settings/balance"}
                        element={<SettingsPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"settings/balance/:id"}
                        element={<SettingsPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"settings/synch"}
                        element={<SettingsPage activeTab={3}/>}
                    />}

                    {<Route
                        path={"settings/synch/:id"}
                        element={<SettingsPage activeTab={3}/>}
                    />}

                    {<Route
                        path={"settings/traffic"}
                        element={<SettingsPage activeTab={4}/>}
                    />}

                    {<Route
                        path={"settings/traffic/:id"}
                        element={<SettingsPage activeTab={4}/>}
                    />}

                    {<Route
                        path={"settings/access"}
                        element={<SettingsPage activeTab={5}/>}
                    />}

                    {<Route
                        path={"settings/access/:id"}
                        element={<SettingsPage activeTab={5}/>}
                    />}

                    {<Route
                        path={"reports"}
                        element={<ReportsPage activeTab={1}/>}
                    />}
                    {<Route
                        path={"reports/traffic"}
                        element={<ReportsPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"reports/balance"}
                        element={<ReportsPage activeTab={2}/>}
                    />}
                    {<Route
                        path={"reports/audit"}
                        element={<ReportsPage activeTab={3}/>}
                    />}

                    {<Route
                        path={"references"}
                        element={<ReferencesPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"slots"}
                        element={<MainSlotsPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"references/clusters"}
                        element={<ReferencesPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"references/clusters/:id"}
                        element={<ReferencesPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"references/servers"}
                        element={<ReferencesPage activeTab={7}/>}
                    />}

                    {<Route
                        path={"references/servers/:id"}
                        element={<ReferencesPage activeTab={7}/>}
                    />}

                    {<Route
                        path={"references/vendors"}
                        element={<ReferencesPage activeTab={2}/>}
                    />}

                    {<Route
                        path={"references/vendors/:id"}
                        element={<ReferencesPage activeTab={2}/>}
                    />}

                    {<Route
                        path={"references/departments"}
                        element={<ReferencesPage activeTab={3}/>}
                    />}

                    {<Route
                        path={"references/departments/:id"}
                        element={<ReferencesPage activeTab={3}/>}
                    />}

                    {<Route
                        path={"references/records"}
                        element={<ReferencesPage activeTab={4}/>}
                    />}

                    {<Route
                        path={"references/records/:id"}
                        element={<ReferencesPage activeTab={4}/>}
                    />}

                    {<Route
                        path={"references/roles"}
                        element={<ReferencesPage activeTab={5}/>}
                    />}

                    {<Route
                        path={"references/roles/:id"}
                        element={<ReferencesPage activeTab={5}/>}
                    />}

                    {<Route
                        path={"references/users"}
                        element={<ReferencesPage activeTab={6}/>}
                    />}

                    {<Route
                        path={"references/users/:id"}
                        element={<ReferencesPage activeTab={6}/>}
                    />}

                    {<Route
                        path={"debug"}
                        element={<DebugPage activeTab={1}/>}
                    />}
                    {<Route
                        path={"debug/redis"}
                        element={<DebugPage activeTab={1}/>}
                    />}

                    {<Route
                        path={"debug/clickHouse"}
                        element={<DebugPage activeTab={2}/>}
                    />}

                    {<Route
                        path={"s3clone"}
                        element={<BucketClonePage/>}
                    />}

                    {<Route
                        path={"s3clone/:id"}
                        element={<BucketClonePage/>}
                    />}



                    <Route path={"400"} element={<Page404/>}/>
                </Route>
            </Routes>
        </QueryParamProvider>
    </>
});
