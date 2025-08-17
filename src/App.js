import React, {Suspense, useEffect} from "react";
import "./scss/style.scss";
import {BrowserRouter} from "react-router-dom";
import {EventsProvider} from "./context/EventsContext";
import {ModalsProvider} from "./context/ModalsProvider";
import {QueryClient, QueryClientProvider} from "react-query";
import {isMac, isSafari} from "./utils/utils";
import {AuthProvider} from "./context/AuthProvider";
import {Routing} from "./Routing";
import {CookiesProvider} from "react-cookie";

const App = () => {
    useEffect(() => {
        if (isSafari() || isMac()) {
            document.body.classList.add("mac-browser");
        }
    }, []);


    const loading = (
        <div className={"pt-3 text-center"}>
            <div className={"sk-spinner sk-spinner-pulse"}/>
        </div>
    );

    const client = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: true,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
            <BrowserRouter>
                <CookiesProvider>
                    <QueryClientProvider client={client}>
                            <AuthProvider>
                                    <EventsProvider>
                                        <ModalsProvider>
                                            <Suspense fallback={loading}>
                                                <Routing/>
                                            </Suspense>
                                        </ModalsProvider>
                                    </EventsProvider>
                            </AuthProvider>
                    </QueryClientProvider>
                </CookiesProvider>
            </BrowserRouter>
    );
};

export default App;
